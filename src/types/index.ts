export interface RoastReport {
  id?: string
  url: string
  score: number
  summary?: string[]
  working?: string[]
  broken?: string[]
  verdict: string
  status: 'success' | 'unreachable' | 'empty' | 'error'
  slug?: string
  created_at?: string
}
