import { Layout } from '@/components/dom/Layout'
import '@/global.css'

import { Noto_Sans } from 'next/font/google'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata = {
  title: 'CNDF',
  description: 'CNDF 홈페이지 내용',
}

export default function RootLayout({ children }) {
  return (
    <html lang='ko' className={`antialiased ${notoSans.className}`}>
      <head />
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
