export interface RoastReport {
  slug?: string
  url: string
  score: number
  summary: string[]
  verdict: string
  status: 'success' | 'unreachable' | 'empty' | 'error'
  created_at?: string
}

export interface RoastRequestBody {
  url: string
}

export interface RoastApiResponse {
  success: boolean
  data?: RoastReport
  shareUrl?: string | null
  cached?: boolean
  error?: string
}