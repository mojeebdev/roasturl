'use client'

import { useRef } from 'react'
import { toPng } from 'html-to-image'
import { RoastReport } from '@/types'
import { getScoreColor, getScoreLabel, getScoreGlow } from '@/lib/utils'
import { Download, Share2 } from 'lucide-react'

interface RoastCardProps {
  report: RoastReport
  shareUrl?: string | null
}

export default function RoastCard({ report, shareUrl }: RoastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const scoreColor = getScoreColor(report.score)
  const scoreLabel = getScoreLabel(report.score)
  const scoreGlow = getScoreGlow(report.score)

  const handleDownload = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0E0A1A',
      })
      const link = document.createElement('a')
      link.download = `roasturl-${report.slug ?? Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const handleShare = async () => {
    const link = shareUrl ?? 'https://roasturl.xyz'
    const text = `⚔ Just received a RoastURL verdict\n\n"${report.verdict}"\n\nScore: ${report.score}/100 · ${getScoreLabel(report.score)}\n\nFull audit → ${link}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'RoastURL Audit Report', text, url: link })
      } else {
        await navigator.clipboard.writeText(text)
        alert('Copied to clipboard!')
      }
    } catch { /* user cancelled */ }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>

      {/* ── THE CARD ── */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)',
          boxShadow: `0 0 60px ${scoreGlow}, 0 20px 60px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Mechanical grid inside card */}
        <div
          className="mech-grid"
          style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }}
        />

        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${scoreColor} 30%, ${scoreColor} 70%, transparent 100%)`,
          pointerEvents: 'none',
          opacity: 0.9,
        }} />

        {/* Corner marks */}
        <div style={{
          position: 'absolute', top: -1, left: -1, width: 14, height: 14,
          borderTop: `1px solid ${scoreColor}`, borderLeft: `1px solid ${scoreColor}`,
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', bottom: -1, right: -1, width: 14, height: 14,
          borderBottom: `1px solid ${scoreColor}`, borderRight: `1px solid ${scoreColor}`,
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', top: -1, right: -1, width: 14, height: 14,
          borderTop: `1px solid var(--border-subtle)`, borderRight: `1px solid var(--border-subtle)`,
          opacity: 0.4,
        }} />
        <div style={{
          position: 'absolute', bottom: -1, left: -1, width: 14, height: 14,
          borderBottom: `1px solid var(--border-subtle)`, borderLeft: `1px solid var(--border-subtle)`,
          opacity: 0.4,
        }} />

        <div style={{ position: 'relative', zIndex: 10, padding: '24px' }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: '9px', letterSpacing: '0.35em',
                color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '5px',
              }}>
                Audit Report
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--white-50)',
                letterSpacing: '0.02em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: '280px',
              }}>
                {report.url}
              </p>
            </div>
            <div style={{
              flexShrink: 0,
              fontSize: '9px',
              letterSpacing: '0.25em',
              padding: '5px 10px',
              border: `1px solid ${scoreColor}40`,
              background: `${scoreColor}10`,
              color: scoreColor,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {scoreLabel}
            </div>
          </div>

          {/* ── Score ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '12px' }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(72px, 18vw, 88px)',
                lineHeight: 1,
                color: scoreColor,
                display: 'block',
                filter: `drop-shadow(0 0 20px ${scoreColor}50)`,
                letterSpacing: '0.02em',
              }}>
                {report.score}
              </span>
            </div>
            <div style={{ paddingBottom: '12px' }}>
              <p style={{ color: 'var(--white-25)', fontSize: '12px', marginBottom: '2px' }}>/100</p>
              <p style={{
                fontSize: '9px', letterSpacing: '0.35em',
                color: 'var(--gold-dim)', textTransform: 'uppercase',
              }}>Roast Score</p>
            </div>
          </div>

          {/* Score bar */}
          <div style={{
            height: '3px', background: 'rgba(255,255,255,0.05)',
            marginBottom: '20px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${report.score}%`,
              background: `linear-gradient(90deg, ${scoreColor}50, ${scoreColor})`,
              transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>

          {/* ── Summary bullets ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {report.summary.map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '16px', height: '16px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px',
                }}>
                  <div style={{
                    width: '5px', height: '5px',
                    border: `1px solid ${scoreColor}`,
                    transform: 'rotate(45deg)',
                    flexShrink: 0,
                    background: `${scoreColor}20`,
                  }} />
                </div>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--white-50)',
                  lineHeight: 1.6,
                  letterSpacing: '0.01em',
                }}>
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <div style={{
              width: '4px', height: '4px',
              background: 'var(--gold-dim)', transform: 'rotate(45deg)',
            }} />
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {/* ── Verdict ── */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '9px', letterSpacing: '0.35em',
              color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '10px',
            }}>
              Final Verdict
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(16px, 3.5vw, 19px)',
              color: 'var(--white-80)',
              lineHeight: 1.5,
              letterSpacing: '0.01em',
            }}>
              &ldquo;{report.verdict}&rdquo;
            </p>
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: '12px', borderTop: '1px solid var(--border-subtle)',
          }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(200,168,75,0.2)', textTransform: 'uppercase' }}>
              roasturl.xyz
            </p>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.05em' }}>
              Gemini 2.5 Flash
            </p>
          </div>

        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div style={{
        display: 'flex', gap: '8px',
        width: '100%', maxWidth: '520px',
      }}>
        <button
          onClick={handleDownload}
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '13px 16px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
            color: 'var(--white-50)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-mid)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--white-80)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--white-50)'
          }}
        >
          <Download size={13} />
          Save
        </button>

        <button
          onClick={handleShare}
          style={{
            flex: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '13px 16px',
            border: '1px solid var(--gold)',
            background: 'linear-gradient(135deg, var(--gold-dim) 0%, var(--gold) 60%, var(--gold-bright) 100%)',
            color: '#07050F',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'
          }}
        >
          <Share2 size={13} />
          Share Report
        </button>
      </div>
    </div>
  )
}
