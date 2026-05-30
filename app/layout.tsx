import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { NavigationShell } from "@/components/navigation-shell"
import { Toaster } from "@/components/ui/toaster"

const notoSans = Noto_Sans({
  subsets: ["latin", "vietnamese"],
})

export const metadata: Metadata = {
  title: {
    default: "Kết Nối Di Sản - Nền tảng văn hóa Việt Nam",
    template: "%s | Kết Nối Di Sản"
  },
  description: "Khám phá, bảo tồn và lan tỏa giá trị di sản văn hóa Việt Nam thông qua công nghệ và cộng đồng.",
  keywords: ["di sản", "văn hóa", "Việt Nam", "nghệ nhân", "cộng đồng", "bảo tồn"],
  authors: [{ name: "Kết Nối Di Sản Team" }],
  openGraph: {
    title: "Kết Nối Di Sản - Nền tảng văn hóa Việt Nam",
    description: "Khám phá và chia sẻ giá trị di sản văn hóa Việt Nam.",
    url: "https://ketnoidisan.vercel.app",
    siteName: "Kết Nối Di Sản",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kết Nối Di Sản Logo",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kết Nối Di Sản - Nền tảng văn hóa Việt Nam",
    description: "Khám phá và chia sẻ giá trị di sản văn hóa Việt Nam.",
    images: ["/og-image.png"],
  },
  manifest: "/favicon_io/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${notoSans.className} font-sans antialiased dark`} suppressHydrationWarning>
        <NavigationShell>
          {children}
        </NavigationShell>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
