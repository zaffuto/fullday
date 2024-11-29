import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/ui/Navbar'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FulldayGO - Generador de Códigos QR',
  description: 'Genera códigos QR atractivos para descuentos en WhatsApp y Telegram',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    title: 'FulldayGO - Generador de Códigos QR',
    description: 'Genera códigos QR atractivos para descuentos en WhatsApp y Telegram',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t">
              <div className="container mx-auto px-4 py-6">
                <p className="text-center text-sm text-gray-600">
                  {new Date().getFullYear()} FulldayGO. Todos los derechos reservados.
                </p>
              </div>
            </footer>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
