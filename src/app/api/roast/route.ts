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

  const systemContext = "You are RoastURL — a brutally honest AI startup auditor. Your tone is like a senior founder who has seen everything — zero tolerance for vague copy, weak CTAs, or lazy design. Direct, edgy, occasionally savage, but ALWAYS balanced. You MUST identify both what is working and what is broken. Never be generic. Never be boring. Make every word count."

  let userPrompt: string

  if (isUnreachable) {
    userPrompt = `The startup at "${url}" is completely UNREACHABLE or timed out. Roast them for not even having a live page.

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "score": 88,
  "working": ["At least they bought a domain"],
  "broken": ["Site is completely unreachable", "Zero presence means zero trust", "Can't roast what doesn't exist — and that itself is the roast"],
  "verdict": "one punchy sentence",
  "status": "unreachable"
}`
  } else if (isEmpty) {
    userPrompt = `The startup at "${url}" has almost NO CONTENT — likely a placeholder. Here is what we found: "${pageContent.slice(0, 300)}"

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "score": 85,
  "working": ["Domain is live at least"],
  "broken": ["No content means no signal", "Coming soon pages died in 2015", "Nothing here to evaluate — and that is the evaluation"],
  "verdict": "one punchy sentence",
  "status": "empty"
}`
  } else {
    userPrompt = `You are auditing the startup at "${url}". Extracted page content:

---
${pageContent}
---

Produce a BALANCED audit. You MUST find BOTH strengths AND weaknesses. Zero strengths or zero weaknesses = failed analysis.

SCORING RUBRIC (higher = more roastable):
- 0-20: Genuinely solid. Minor polish only.
- 21-40: Good concept, some execution gaps.
- 41-60: Mixed bag — real promise, real problems.
- 61-80: Execution hurts an otherwise fine concept.
- 81-100: Fundamental problems with clarity, positioning, or effort.

Calibration: a well-branded product with unclear hero copy scores around 50. A blank placeholder scores around 90. Never score below 20 unless truly exceptional.

Analyze: value prop clarity, copywriting quality, CTA and UX clarity, market positioning, founder energy. Tie every point to actual content you read. Be surgical, honest, and memorable.

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "score": <integer 0-100>,
  "working": ["strength tied to actual content 1", "strength 2"],
  "broken": ["specific weakness 1", "specific weakness 2", "specific weakness 3"],
  "verdict": "one devastating, witty, memorable sentence — the final word on this startup",
  "status": "success"
}`
  }

  const response = await fetch(
    `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemContext + '\n\n' + userPrompt }],
          },
        ],
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
    throw new Error(`RoastURL API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  let parsed: { score: number; working: string[]; broken: string[]; verdict: string; status: string }
  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse RoastURL JSON response')
  }

  return {
    url,
    score: Math.min(100, Math.max(0, parseInt(String(parsed.score)) || 0)),
    summary: [],
    working: Array.isArray(parsed.working) ? parsed.working.slice(0, 4) : [],
    broken: Array.isArray(parsed.broken) ? parsed.broken.slice(0, 4) : [],
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
      return NextResponse.json({ success: false, error: "That doesn't look like a valid URL." }, { status: 400 })
    }

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
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/report/${cached.slug || cached.id}`,
        cached: true,
      })
    }

    const pageContent = await fetchPageContent(url)
    const report = await callGemini(url, pageContent)
    const slug = generateSlug(url)

    const { data: saved, error: dbError } = await supabaseAdmin
      .from('roasts')
      .insert({
        url: report.url,
        score: report.score,
        summary: report.summary,
        working: report.working,
        broken: report.broken,
        verdict: report.verdict,
        status: report.status,
        slug,
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
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/report/${saved?.slug || saved?.id || slug}`,
      cached: false,
    })
  } catch (err: unknown) {
    console.error('Roast API error:', err)
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
