import { NextRequest, NextResponse } from 'next/server'
import { isValidUrl, normalizeUrl } from '@/lib/utils'
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

  const systemContext = `You are RoastURL — a brutally honest AI startup auditor. Your tone is like a senior founder who has seen everything — zero tolerance for vague copy, weak CTAs, or lazy design. Direct, edgy, occasionally savage, but ALWAYS balanced. You MUST identify both what is working and what is b