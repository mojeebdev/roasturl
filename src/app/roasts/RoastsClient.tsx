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
  const medals = ['⚔', '⚡', '🔥']

  return (
    <Link
      href={reportUrl}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '48px 1fr auto',
          gap: '16px',
          alignItems: 'center',
          padding: '16px 20px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          transition: 'background 0.15s',
          position: 'relative',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(200,168,75,0.03)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'
        }}
      >
        {/* Left accent on hover */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px',
          background: `linear-gradient(180deg, transparent, ${scoreColor}, transparent)`,
          opacity: rank <= 3 ? 0.6 : 0.2,
        }} />

        {/* Rank */}
        <div style={{ textAlign: 'center' }}>
          {rank <= 3 ? (
            <span style={{ fontSize: '18px', display: 'block', lineHeight: 1 }}>{medals[rank - 1]}</span>
          ) : (
            <span style={{
              fontFamily: 'var(--font-hero)',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.12)',
              letterSpacing: '0.05em',
              display: 'block',
            }}>
              {rank}
            </span>
          )}
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
            marginBottom: '5px',
            letterSpacing: '0.03em',
          }}>
            {roast.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </p>
          {roast.verdict && (
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.2)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '5px',
              letterSpacing: '0.01em',
            }}>
              "{roast.verdict}"
            </p>
          )}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            {formatDate(roast.created_at)}
          </p>
        </div>

        {/* Score + label */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-hero)',
            fontSize: '28px',
            color: scoreColor,
            lineHeight: 1,
            display: 'block',
            letterSpacing: '0.02em',
            filter: `drop-shadow(0 0 10px ${scoreColor}40)`,
          }}>
            {roast.score}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            color: scoreColor,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: 0.6,
            display: 'block',
            marginTop: '2px',
          }}>
            {scoreLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '12px 16px',
      background: 'var(--bg-card)',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-hero)', fontSize: '18px', color: 'var(--white-80)', letterSpacing: '0.04em' }}>
        {value}
      </div>
    </div>
  )
}

export default function RoastsClient({ roasts }: Props) {
  const [tab, setTab] = useState<'brutal' | 'recent'>('brutal')

  const sorted = tab === 'brutal'
    ? [...roasts].sort((a, b) => b.score - a.score)
    : [...roasts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const avgScore = roasts.length
    ? Math.round(roasts.reduce((a, b) => a + b.score, 0) / roasts.length)
    : 0

  const topScore = roasts.length
    ? Math.max(...roasts.map(r => r.score))
    : 0

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start px-4 py-14 overflow-x-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Background layers */}
      <div className="fixed inset-0 mech-grid pointer-events-none" style={{ opacity: 1 }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61,31,140,0.22) 0%, transparent 70%)' }} />
      <div className="fixed top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-bright) 50%, var(--gold) 70%, transparent 100%)', opacity: 0.5 }} />
      <div
        className="fixed left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.06), transparent)', animation: 'scan 10s linear infinite', zIndex: 1 }}
      />

      <div className="relative z-10 flex flex-col items-center w-full gap-8 max-w-[620px]">

        {/* Nav */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-dim)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold-dim)')}
          >
            ← roasturl.xyz
          </Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(200,168,75,0.25)', textTransform: 'uppercase' }}>
            {roasts.length} total audits
          </p>
        </div>

        {/* Header */}
        <div className="text-center w-full">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div style={{ height: '1px', width: '28px', background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.35em', color: 'var(--gold-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              RoastURL · Archive
            </span>
            <div style={{ height: '1px', width: '28px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-hero)',
            fontSize: 'clamp(36px, 9vw, 60px)',
            letterSpacing: '0.06em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--white-80) 0%, var(--white-full) 40%, var(--gold-bright) 70%, var(--gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
          }}>
            HALL OF FAME
          </h1>

          <div className="flex items-center gap-3 justify-center mb-5">
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-mid))' }} />
            <div style={{ width: '4px', height: '4px', background: 'var(--gold)', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border-mid), transparent)' }} />
          </div>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(13px, 3vw, 16px)',
            color: 'var(--white-25)',
            lineHeight: 1.5,
            maxWidth: '360px',
            margin: '0 auto',
          }}>
            Every startup that stepped into the arena.<br />Some survived. Most did not.
          </p>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'flex', width: '100%',
          gap: '1px', background: 'var(--border-subtle)',
          border: '1px solid var(--border-subtle)',
        }}>
          <StatPill label="Total Roasted" value={String(roasts.length)} />
          <StatPill label="Avg Score" value={String(avgScore)} />
          <StatPill label="Most Brutal" value={String(topScore)} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', width: '100%',
          gap: '1px', background: 'var(--border-subtle)',
          border: '1px solid var(--border-subtle)',
        }}>
          {(['brutal', 'recent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '13px',
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
              {t === 'brutal' ? '⚔  Most Roasted' : '🕐  Most Recent'}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ width: '100%', border: '1px solid var(--border-subtle)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          <div style={{ position: 'absolute', top: 1, left: -1, width: 12, height: 12, borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: 1, right: -1, width: 12, height: 12, borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.5 }} />

          {sorted.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
                No roasts yet.
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.1)' }}>
                Be the first to step into the arena.
              </p>
            </div>
          ) : (
            sorted.map((roast, i) => <RoastRow key={roast.id} roast={roast} rank={i + 1} />)
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
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

        {/* Arcapush CTA */}
        <div style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', padding: '16px 20px', width: '100%', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.4 }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Get your product discovered
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'var(--white-50)', marginBottom: '12px', lineHeight: 1.5 }}>
            List your project on{' '}
            <a href="https://arcapush.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontStyle: 'normal', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
              Arcapush
            </a>
            {' '}— free, and live in minutes.
          </p>
          <a
            href="https://arcapush.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px', border: '1px solid var(--gold)', background: 'rgba(200,168,75,0.06)', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,168,75,0.12)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,168,75,0.06)' }}
          >
            Submit Free →
          </a>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(200,168,75,0.2)', textTransform: 'uppercase' }}>
            Powered by Gemini 2.5 Flash · Built by{' '}
            <a href="https://blindspotlab.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}>BlindspotLab</a>
            {' '}·{' '}
            <a href="https://x.com/mojeebeth" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}>@mojeebeth</a>
            {' '}·{' '}
            <a href="https://arcapush.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}>Arcapush</a>
          </p>
        </footer>

      </div>
    </main>
  )
}
