import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import ReportClient from '../../../components/ReportClient'

interface ReportPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { data: report } = await supabaseAdmin
    .from('roasts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!report) {
    return { title: 'Report Not Found — RoastURL' }
  }

  const title = `${report.url} got roasted — Score: ${report.score}/100`
  const description = `"${report.verdict}" | RoastURL Brutal AI Startup Audit`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/report/${params.slug}`,
      siteName: 'RoastURL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@mojeebeth',
    },
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { data: report, error } = await supabaseAdmin
    .from('roasts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!report || error) {
    notFound()
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/report/${params.slug}`

  return <ReportClient report={report} shareUrl={shareUrl} />
}