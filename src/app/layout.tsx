import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'RoastURL — Precision AI Startup Audit',
  description: 'Drop your startup URL. Receive a surgical, no-mercy AI audit in seconds. No sugarcoating. No platitudes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://roasturl.xyz'),
  icons: {
    icon:[ { url: '/favicon.ico' } ],
    apple:[
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },

  openGraph: {
    title: 'RoastURL — Precision AI Startup Audit',
    description: 'Drop your URL. Get burned. Share the pain.',
    url: 'https://roasturl.xyz',
    siteName: 'RoastURL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoastURL',
    description: 'Drop your URL. Get burned.',
    creator: '@mojeebeth',
  },
  keywords: ['startup audit', 'AI roast', 'website review', 'startup feedback', 'vibe check', 'roast my startup', 'brutal audit', 'founder feedback'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://googleapis.com" />
        <link rel="preconnect" href="https://gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <Script 
          src="https://umami.is" 
          data-website-id="15f1ddc8-1e57-4163-ba49-88b1766aadea"
          strategy="afterInteractive"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children} 
      </body>
    </html>
  )
}
