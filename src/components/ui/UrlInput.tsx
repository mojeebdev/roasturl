'use client'

import { useState } from 'react'
import { Loader2, ArrowRight } from 'lucide-react'
import { RoastReport } from '@/types'

interface UrlInputProps {
  onResult: (report: RoastReport, shareUrl: string | null) => void
  onError: (msg: string) => void
  loading: boolean
  setLoading: (v: boolean) => void
}

const LOADING_MESSAGES = [
  'Fetching your page...🔥🔥🔥',
  'Reading between the lines... 🔍',
  'Calibrating the blade... 🔪',
  'Rendering judgment... ⚖️',
]

export default function UrlInput({ onResult, onError, loading, setLoading }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [loadMsg, setLoadMsg] = useState(LOADING_MESSAGES[0])
  const [focused, setFocused] = useState(false)

  const handleRoast = async () => {
    const trimmed = url.trim()
    if (!trimmed || loading) return
    setLoading(true)
    onError('')
    let msgIndex = 0
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length
      setLoadMsg(LOADING_MESSAGES[msgIndex])
    }, 2200)
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data = await res.json()
      if (data.success && data.data) {
        onResult(data.data, data.shareUrl ?? null)
      } else {
        onError(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      onError('Network error. Check your connection and try again.')
    } finally {
      clearInterval(msgInterval)
      setLoadMsg(LOADING_MESSAGES[0])
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleRoast()
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Input label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '2px',
      }}>
        <div style={{
          width: '6px', height: '6px',
          background: focused ? 'var(--gold)' : 'var(--gold-dim)',
          transform: 'rotate(45deg)',
          transition: 'background 0.2s',
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '0.35em',
          color: focused ? 'var(--gold-dim)' : 'rgba(200,168,75,0.3)',
          textTransform: 'uppercase',
          transition: 'color 0.2s',
        }}>
          Target URL
        </span>
      </div>

      {/* Input + button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          border: focused
            ? '1px solid var(--border-mid)'
            : '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          transition: 'border-color 0.25s, box-shadow 0.25s',
          boxShadow: focused
            ? '0 0 0 1px rgba(200,168,75,0.08), 0 4px 24px rgba(0,0,0,0.4)'
            : '0 2px 12px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
      >
        {/* corner marks */}
        <div style={{
          position: 'absolute', top: -1, left: -1, width: 10, height: 10,
          borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)',
          opacity: focused ? 0.7 : 0.25, transition: 'opacity 0.2s',
        }} />
        <div style={{
          position: 'absolute', bottom: -1, right: -1, width: 10, height: 10,
          borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)',
          opacity: focused ? 0.7 : 0.25, transition: 'opacity 0.2s',
        }} />

        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="yourstartup.xyz"
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '15px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--white-80)',
            letterSpacing: '0.03em',
            opacity: loading ? 0.5 : 1,
          }}
        />

        {/* Divider */}
        <div style={{ width: '1px', background: 'var(--border-subtle)', flexShrink: 0 }} />

        <button
          onClick={handleRoast}
          disabled={loading || !url.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 20px',
            background: loading || !url.trim()
              ? 'rgba(200,168,75,0.06)'
              : 'linear-gradient(135deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-bright) 100%)',
            border: 'none',
            cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: loading || !url.trim() ? 'var(--gold-dim)' : '#07050F',
            minWidth: '120px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            if (!loading && url.trim()) {
              (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'
          }}
        >
          {loading
            ? <Loader2 size={13} style={{ animation: 'rotateSlow 1s linear infinite', flexShrink: 0 }} />
            : <ArrowRight size={13} style={{ flexShrink: 0 }} />
          }
          {loading ? 'Auditing' : 'Audit'}
        </button>
      </div>

      {/* Loading message */}
      {loading ? (
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: 'var(--gold-dim)',
          textTransform: 'uppercase',
          animation: 'pulse-glow 2s ease infinite',
        }}>
          {loadMsg}
        </p>
      ) : (
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: 'rgba(200,168,75,0.2)',
          textTransform: 'uppercase',
        }}>
          Submit a URL · Receive judgment
        </p>
      )}
    </div>
  )
}
