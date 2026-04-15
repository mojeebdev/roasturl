import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import RoastsClient from './RoastsClient'

export const metadata: Metadata = {
  title: 'Hall of Fame — RoastURL',
  description: 'Every startup that survived the audit. Ranked by roastability.',
}

export const revalidate = 60

export default async function RoastsPage() {
  const { data: roasts } = await supabaseAdmin
    .from('roasts')
    .select('id, url, score, verdict, status, created_at, slug')
    .order('created_at', { ascending: false })
    .limit(100)

  return <RoastsClient roasts={roasts || []} />
}