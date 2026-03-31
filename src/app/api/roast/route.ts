import { NextRequest, NextResponse } from 'next/server'
import { isValidUrl, normalizeUrl, generateSlug } from '@/lib/utils'
import { supabaseAdmin } from '@/lib/supabase'
import { RoastReport } from '@/types'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent'

async function fetchPageContent(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RoastURL/1.0; +https://roasturl.xyz)',
      },
    })
    clearTimeout(timeout)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 4000)

    return text.length > 50 ? text : 'EMPTY_PAGE'
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('abort') || msg.includes('timeout')) return 'TIMEOUT'
    return 'UNREACHABLE'
  }
}

async function callGemini(url: string, pageContent: string): Promise<RoastReport> {
  const isUnreachable = pageContent === 'UNREACHABLE' || pageContent === 'TIMEOUT'
  const isEmpty = pageContent === 'EMPTY_PAGE' || pageContent.length < 100

  const systemContext = `You are RoastURL — a brutally honest AI startup auditor. You deliver sharp, witty, and constructive "roasts" of startup websites. Your tone is like a senior founder who has seen everything — zero tolerance for vague copy, weak CTAs, or lazy design. You are direct, edgy, occasionally savage, but always honest. Never be generic. Never be boring. Make every word count.`

  let userPrompt: string

  if (isUnreachable) {
    userPrompt = `The startup at "${url}" is completely UNREACHABLE or timed out. Roast them for not even having a live page. Be savage but brief.

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "score": 3,
  "summary": ["bullet 1", "bullet 2", "bullet 3"],
  "verdict": "one punchy sentence",
  "status": "unreachable"
}`
  } else if (isEmpty) {
    userPrompt = `The startup at "${url}" has almost NO CONTENT — likely a placeholder or coming soon page. Here is what little we found: "${pageContent.slice(0, 300)}"

Roast them for the lack of effort. Make it sting.

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "score": 12,
  "summary": ["bullet 1", "bullet 2", "bullet 3"],
  "verdict": "one punchy sentence",
  "status": "empty"
}`
  } else {
    userPrompt = `Audit the startup at "${url}". Here is the extracted page content:

---
${pageContent}
---

Analyze across these dimensions:
1. Value proposition clarity — can a stranger understand it in 5 seconds?
2. Copywriting quality — punchy or corporate fluff?
3. UX signals — clear CTA? friction? trust signals?
4. Market positioning — differentiated or generic?
5. Founder energy — does this feel like a serious product or a side project?

Be surgical. Be honest. Be memorable. Give specific feedback tied to actual content you read.

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "score": <integer 0-100, higher = more issues/more roastable>,
  "summary": ["sharp critique 1", "sharp critique 2", "sharp critique 3", "sharp critique 4"],
  "verdict": "one punchy, witty, memorable sentence — the final word on this startup's vibe",
  "status": "success"
}`
  }

  const response = await fetch(
    `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemContext + '\n\n' + userPrompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 700,
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  let parsed: { score: number; summary: string[]; verdict: string; status: string }
  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse Gemini JSON response')
  }

  return {
    url,
    score: Math.min(100, Math.max(0, parseInt(String(parsed.score)) || 0)),
    summary: Array.isArray(parsed.summary) ? parsed.summary.slice(0, 5) : [],
    verdict: typeof parsed.verdict === 'string' ? parsed.verdict : 'No verdict available.',
    status: (['success', 'unreachable', 'empty', 'error'].includes(parsed.status)
      ? parsed.status
      : 'success') as RoastReport['status'],
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rawUrl: string = (body?.url || '').trim()

    if (!rawUrl) {
      return NextResponse.json({ success: false, error: 'URL is required.' }, { status: 400 })
    }

    const url = normalizeUrl(rawUrl)

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: "That doesn't look like a valid URL." },
        { status: 400 }
      )
    }

    // Cache check — same URL roasted in last 1 hour
    const { data: cached } = await supabaseAdmin
      .from('roasts')
      .select('*')
      .eq('url', url)
      .gte('created_at', new Date(Date.now() - 3_600_000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/report/${cached.slug}`,
        cached: true,
      })
    }

    // Fetch page + roast
    const pageContent = await fetchPageContent(url)
    const report = await callGemini(url, pageContent)

    // Generate slug from URL + timestamp
    const slug = generateSlug(url)

    // Persist to Supabase
    const { data: saved, error: dbError } = await supabaseAdmin
      .from('roasts')
      .insert({
        slug,
        url: report.url,
        score: report.score,
        summary: report.summary,
        verdict: report.verdict,
        status: report.status,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase insert error:', dbError)
    }

    const finalReport = saved || { ...report, slug }

    return NextResponse.json({
      success: true,
      data: finalReport,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/report/${slug}`,
      cached: false,
    })
  } catch (err: unknown) {
    console.error('Roast API error:', err)
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}