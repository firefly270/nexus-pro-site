import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import sitemap from 'vite-plugin-sitemap'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
const isAnalyze = process.argv.some(a => a === 'analyze' || a === '--mode analyze')

export default defineConfig({
  base: process.env.GH_PAGES ? '/nexus-pro-site/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    sitemap({ hostname: 'https://gpurevolution.space/' }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,svg}'],
        runtimeCaching: [
          {
            urlPattern: /\.(woff2|svg)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'asset-cache', expiration: { maxEntries: 20, maxAgeSeconds: 86400 * 30 } },
          },
        ],
      },
      manifest: {
        name: 'The GPU Revolution',
        short_name: 'GPU Story',
        description: 'A 3D scrollytelling journey through GPU history',
        theme_color: '#030303',
        background_color: '#030303',
        display: 'standalone',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
    viteCompression({ algorithm: 'brotliCompress', threshold: 1024 }),
    isAnalyze && visualizer({ filename: 'dist/stats.html', open: true }),
  ].filter(Boolean),
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  build: {
    target: 'es2023',
    cssMinify: 'lightningcss',
    sourcemap: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react'
          if (id.includes('node_modules/three')) return 'vendor-three'
          if (id.includes('node_modules/@react-three')) return 'vendor-r3f'
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/lenis')) return 'vendor-lenis'
          if (id.includes('node_modules')) return 'vendor'
          return undefined
        },
      },
    },
  },
})
