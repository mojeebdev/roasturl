'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getScoreColor, getScoreLabel } from '@/lib/utils'

interface Roast {
  id: string
  url: string
  score: number
  verdict?: string
  status: string
  created_at: string
  slug?: string
}

interface Props {
  roasts: Roast[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function RoastRow({ roast, rank }: { roast: Roast; rank: number }) {
  const scoreColor = getScoreColor(roast.score)
  const scoreLabel = getScoreLabel(roast.score)
  const reportUrl = roast.slug ? `/report/${roast.slug}` : `/report/${roast.id}`

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr auto',
      gap: '16px',
      alignItems: 'center',
      padding: '14px 20px',
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card)')}
    >
      {/* Rank */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: rank <= 3 ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
        letterSpacing: '0.1em',
        textAlign: 'center',
      }}>
        {rank <= 3 ? ['⚔', '⚡', '🔥'][rank - 1] : `#${rank}`}
      </div>

      {/* URL + date */}
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--white-50)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '3px',
          letterSpacing: '0.02em',
        }}>
          {roast.url.replace(/^https?:\/\//, '')}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          {formatDate(roast.created_at)}
        </p>
      </div>

      {/* Score + label + link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontFamily: 'var(--font-hero)',
            fontSize: '22px',
            color: scoreColor,
            lineHeight: 1,
            display: 'block',
            filter: `drop-shadow(0 0 8px ${scoreColor}40)`,
          }}>
            {roast.score}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            color: scoreColor,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            {scoreLabel}
          </span>
        </div>

        <Link
          href={reportUrl}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px',
            border: `1px solid ${scoreColor}30`,
            background: `${scoreColor}08`,
            color: scoreColor,
            textDecoration: 'none',
            fontSize: '11px',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = `${scoreColor}18`
            ;(e.currentTarget as HTMLElement).style.borderColor = `${scoreColor}60`
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = `${scoreColor}08`
            ;(e.currentTarget as HTMLElement).style.borderColor = `${scoreColor}30`
          }}
        >
          →
        </Link>
      </div>
    </div>
  )
}

export default function RoastsClient({ roasts }: Props) {
  const [tab, setTab] = useState<'brutal' | 'recent'>('brutal')

  const sorted = tab === 'brutal'
    ? [...roasts].sort((a, b) => b.score - a.score)
    : [...roasts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start px-4 py-14 overflow-x-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="fixed inset-0 mech-grid pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61,31,140,0.22) 0%, transparent 70%)' }} />
      <div className="fixed top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-bright) 50%, var(--gold) 70%, transparent 100%)', opacity: 0.5 }} />

      <div className="relative z-10 flex flex-col items-center w-full gap-8 max-w-[620px]">

        {/* Nav */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            color: 'var(--gold-dim)', textDecoration: 'none',
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            letterSpacing: '0.25em', textTransform: 'uppercase', transition: 'color 0.2s',
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold-dim)')}
          >
            ← roasturl.xyz
          </Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(200,168,75,0.25)', textTransform: 'uppercase' }}>
            {roasts.length} audits
          </p>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.4em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
            RoastURL · Archive
          </p>
          <h1 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'clamp(36px, 8vw, 56px)',
            letterSpacing: '0.06em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--white-80) 0%, var(--white-full) 40%, var(--gold-bright) 70%, var(--gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px',
          }}>
            HALL OF FAME
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(13px, 3vw, 16px)',
            color: 'var(--white-25)',
            lineHeight: 1.5,
          }}>
            Every startup that stepped into the arena.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          width: '100%',
          gap: '1px',
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-subtle)',
        }}>
          {(['brutal', 'recent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '12px',
                background: tab === t ? 'rgba(200,168,75,0.08)' : 'var(--bg-card)',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                color: tab === t ? 'var(--gold)' : 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t === 'brutal' ? '⚔ Most Roasted' : '🕐 Most Recent'}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{
          width: '100%',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Top accent */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

          {/* Corner marks */}
          <div style={{ position: 'absolute', top: -1, left: -1, width: 12, height: 12, borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: -1, right: -1, width: 12, height: 12, borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.5 }} />

          {sorted.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                No roasts yet. Be the first.
              </p>
            </div>
          ) : (
            sorted.map((roast, i) => (
              <RoastRow key={roast.id} roast={roast} rank={i + 1} />
            ))
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
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
            Submit Your URL →
          </Link>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(200,168,75,0.2)', textTransform: 'uppercase' }}>
            Powered by Gemini 2.5 Flash · Built by{' '}
            <a href="https://blindspotlab.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}>BlindspotLab</a>
            {' '}·{' '}
            <a href="https://x.com/mojeebeth" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}>@mojeebeth</a>
          </p>
        </footer>

      </div>
    </main>
  )
}