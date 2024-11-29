/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitamos las nuevas características de Next.js 14
  experimental: {
    // Optimización de fuentes
    optimizeFonts: true,
    // Soporte mejorado para TypeScript
    typedRoutes: true,
    // Nuevo sistema de caché y revalidación
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Mejoras de seguridad
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
