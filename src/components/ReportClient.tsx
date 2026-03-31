'use client'

import Link from 'next/link'
import { useState } from 'react'
import RoastCard from '@/components/card/RoastCard'
import { RoastReport } from '@/types'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { getScoreColor } from '@/lib/utils'

interface ReportClientProps {
  report: RoastReport
  shareUrl: string
}

export default function ReportClient({ report, shareUrl }: ReportClientProps) {
  const [copied, setCopied] = useState(false)
  const scoreColor = getScoreColor(report.score)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start px-4 py-14 overflow-x-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Bg layers */}
      <div className="fixed inset-0 mech-grid pointer-events-none" />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61,31,140,0.2) 0%, transparent 70%)`,
        }}
      />
      <div
        className="fixed top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${scoreColor}80, transparent)`,
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full gap-8 max-w-[560px]">

        {/* Nav */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: 'var(--gold-dim)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold-dim)')}
          >
            <ArrowLeft size={11} />
            roasturl.xyz
          </Link>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(200,168,75,0.25)',
            textTransform: 'uppercase',
          }}>
            Shared Audit
          </p>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.4em',
            color: 'var(--gold-dim)',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            A founder received their verdict
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(18px, 4vw, 24px)',
            color: 'var(--white-50)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: '100%',
            marginBottom: '14px',
          }}>
            {report.url}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-hero)',
              fontSize: 'clamp(48px, 12vw, 64px)',
              color: scoreColor,
              lineHeight: 1,
              filter: `drop-shadow(0 0 16px ${scoreColor}40)`,
            }}>
              {report.score}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--white-25)',
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}>
              / 100
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full animate-fadeIn">
          <RoastCard report={report} shareUrl={shareUrl} />
        </div>

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
            color: copied ? 'var(--gold)' : 'var(--white-25)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Link Copied' : 'Copy Report Link'}
        </button>

        {/* CTA block */}
        <div style={{
          width: '100%', maxWidth: '520px',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          padding: '24px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -1, left: -1, width: 10, height: 10,
            borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.4,
          }} />
          <div style={{
            position: 'absolute', bottom: -1, right: -1, width: 10, height: 10,
            borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.4,
          }} />

          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '16px',
            color: 'var(--white-25)',
            marginBottom: '16px',
            lineHeight: 1.5,
          }}>
            Think your startup can survive the audit?
          </p>

          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px',
              background: 'linear-gradient(135deg, var(--gold-dim) 0%, var(--gold) 60%, var(--gold-bright) 100%)',
              color: '#07050F',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'filter 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.filter = 'brightness(1)')}
          >
            Submit Your URL
          </Link>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(200,168,75,0.2)',
            textTransform: 'uppercase',
          }}>
            Powered by Gemini 2.5 Flash · Built by{' '}
            <a href="https://blindspotlab.xyz" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}>
              BlindspotLab
            </a>
            {' '}·{' '}
            <a href="https://x.com/mojeebeth" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}>
              @mojeebeth
            </a>
          </p>
        </footer>

      </div>
    </main>
  )
}
