'use client'

import { useState } from 'react'
import Link from 'next/link'
import UrlInput from '@/components/ui/UrlInput'
import RoastCard from '@/components/card/RoastCard'
import { RoastReport } from '@/types'

function LogoMark() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="19,2 30,7 36,18 31,30 19,36 8,30 2,18 8,7" stroke="#C8A84B" strokeWidth="1" fill="none" opacity="0.7" />
      <polygon points="19,8 26,11.5 30,18 26,24.5 19,28 12,24.5 8,18 12,11.5" stroke="#7B3FF2" strokeWidth="0.8" fill="rgba(123,63,242,0.08)" opacity="0.9" />
      <line x1="19" y1="4" x2="19" y2="10" stroke="#C8A84B" strokeWidth="0.8" opacity="0.5" />
      <line x1="19" y1="28" x2="19" y2="34" stroke="#C8A84B" strokeWidth="0.8" opacity="0.5" />
      <line x1="4" y1="19" x2="10" y2="19" stroke="#C8A84B" strokeWidth="0.8" opacity="0.5" />
      <line x1="28" y1="19" x2="34" y2="19" stroke="#C8A84B" strokeWidth="0.8" opacity="0.5" />
      <polygon points="19,13 23,18 19,23 15,18" fill="#C8A84B" opacity="0.9" />
      <circle cx="19" cy="18" r="2" fill="#07050F" />
    </svg>
  )
}

function CornerDecor({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const isRight = position.includes('r')
  const isBottom = position.includes('b')
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      style={{
        position: 'absolute',
        top: isBottom ? undefined : 0,
        bottom: isBottom ? 0 : undefined,
        left: isRight ? undefined : 0,
        right: isRight ? 0 : undefined,
        transform: `rotate(${isRight && !isBottom ? 90 : isRight && isBottom ? 180 : isBottom ? 270 : 0}deg)`,
        opacity: 0.4,
      }}
    >
      <line x1="0" y1="1" x2="14" y2="1" stroke="#C8A84B" strokeWidth="1" />
      <line x1="1" y1="0" x2="1" y2="14" stroke="#C8A84B" strokeWidth="1" />
      <circle cx="1" cy="1" r="2" fill="#C8A84B" fillOpacity="0.5" />
    </svg>
  )
}

export default function HomePage() {
  const [report, setReport] = useState<RoastReport | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start px-4 py-14 overflow-x-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="fixed inset-0 mech-grid pointer-events-none" style={{ opacity: 1 }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61,31,140,0.22) 0%, transparent 70%)' }} />
      <div className="fixed top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-bright) 50%, var(--gold) 70%, transparent 100%)', opacity: 0.5 }} />
      <div
        className="fixed left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.06), transparent)', animation: 'scan 10s linear infinite', zIndex: 1 }}
      />

      <div className="relative z-10 flex flex-col items-center w-full gap-10 max-w-[580px] mx-auto">

        {/* Header */}
        <div className="text-center w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div style={{ height: '1px', width: '28px', background: 'linear-gradient(90deg, transparent, var(--gold-dim))' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.35em', color: 'var(--gold-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              BlindspotLab · Precision Instruments
            </span>
            <div style={{ height: '1px', width: '28px', background: 'linear-gradient(90deg, var(--gold-dim), transparent)' }} />
          </div>

          <div className="flex items-center justify-center gap-4 mb-5">
            <LogoMark />
            <div style={{ textAlign: 'left' }}>
              <h1
                className="animate-flicker"
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'clamp(42px, 9vw, 64px)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, var(--white-80) 0%, var(--white-full) 40%, var(--gold-bright) 70%, var(--gold) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ROAST<span style={{ WebkitTextFillColor: 'var(--purple-glow)', fontFamily: 'var(--font-hero)' }}>URL</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginTop: '4px' }}>
                Surgical · Honest · Merciless
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center mb-5">
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-mid))' }} />
            <div style={{ width: '4px', height: '4px', background: 'var(--gold)', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border-mid), transparent)' }} />
          </div>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(15px, 3.5vw, 18px)',
            color: 'var(--white-50)',
            maxWidth: '340px',
            margin: '0 auto',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          }}>
            Submit your startup URL.<br />
            Receive a verdict with{' '}
            <span style={{ color: 'var(--gold)', fontWeight: 500, fontStyle: 'normal' }}>zero mercy</span>.
          </p>
        </div>

        {/* Input */}
        <div className="w-full animate-fadeUp" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <UrlInput
            onResult={(r, url) => { setReport(r); setShareUrl(url) }}
            onError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center space-y-2">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'rotateSlow 2s linear infinite' }}>
                <circle cx="7" cy="7" r="5.5" stroke="var(--gold)" strokeWidth="0.8" fill="none" strokeDasharray="3 2" />
                <circle cx="7" cy="7" r="2" fill="var(--gold)" fillOpacity="0.6" />
              </svg>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.25em', color: 'var(--gold-dim)', textTransform: 'uppercase', animation: 'pulse-glow 2s ease infinite' }}>
                Analyzing · Please wait
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            className="w-full max-w-[520px] px-4 py-3"
            style={{ background: 'rgba(123,63,242,0.08)', border: '1px solid rgba(123,63,242,0.25)', color: 'var(--purple-glow)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.05em' }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Result card */}
        {report && !loading && (
          <div className="w-full flex flex-col items-center animate-fadeIn">
            <RoastCard report={report} shareUrl={shareUrl} />
            <button
              onClick={() => { setReport(null); setShareUrl(null); setError('') }}
              style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--gold-dim)', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--gold-dim)')}
            >
              ← Audit Another URL
            </button>
          </div>
        )}

        {/* Stats strip */}
        {!report && !loading && (
          <div
            className="w-full"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', marginTop: '8px' }}
          >
            {[
              { label: 'Metric', value: 'Zero Bias' },
              { label: 'Engine', value: 'Gemini 2.5' },
              { label: 'Speed', value: '< 8 sec' },
            ].map((item) => (
              <div key={item.label} style={{ padding: '12px 16px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: 'var(--white-80)', letterSpacing: '0.02em' }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Hall of Fame teaser */}
        {!report && !loading && (
          <Link
            href="/roasts"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '14px 20px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
              position: 'relative',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-dim)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)')}
          >
            <div style={{ position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.4 }} />
            <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.4 }} />
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.35em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                ⚔ Hall of Fame
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'var(--white-25)' }}>
                Every startup that stepped into the arena
              </p>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-dim)', flexShrink: 0 }}>→</span>
          </Link>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingBottom: '16px', width: '100%' }}>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-subtle), transparent)', marginBottom: '16px' }} />

          {/* Arcapush CTA */}
          <div style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', padding: '16px 20px', marginBottom: '16px', position: 'relative' }}>
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

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(200,168,75,0.2)', textTransform: 'uppercase' }}>
            Powered by Gemini 2.5 Flash · Crafted by{' '}
            <a href="https://blindspotlab.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--gold-dim)')}
            >BlindspotLab</a>
            {' '}·{' '}
            <a href="https://arcapush.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--gold-dim)')}
            >Arcapush</a>
          </p>
        </footer>

      </div>
    </main>
  )
}
