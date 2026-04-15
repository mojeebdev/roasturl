import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return !!u.hostname
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

export function generateSlug(url: string): string {
  try {
    const { hostname } = new URL(url)
    return hostname
      .replace(/^www\./, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase()
      .replace(/^-|-$/g, '')
  } catch {
    return 'roast'
  }
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'RUTHLESS'
  if (score >= 60) return 'SHARP'
  if (score >= 40) return 'MEASURED'
  if (score >= 20) return 'GENTLE'
  return 'SILENT'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#F0C96A'
  if (score >= 60) return '#C8A84B'
  if (score >= 40) return '#9B6BFF'
  if (score >= 20) return '#7B3FF2'
  return '#3D1F8C'
}

export function getScoreGlow(score: number): string {
  if (score >= 60) return 'rgba(200,168,75,0.2)'
  if (score >= 40) return 'rgba(155,107,255,0.2)'
  return 'rgba(61,31,140,0.2)'
}
