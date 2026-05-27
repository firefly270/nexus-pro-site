import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import sitemap from 'vite-plugin-sitemap'
import compress from 'vite-plugin-compression'
const isAnalyze = process.argv.some(a => a === 'analyze' || a === '--mode analyze')

export default defineConfig({
  base: process.env.GH_PAGES ? '/nexus-pro-site/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    sitemap({ hostname: 'https://gpurevolution.space/' }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'The GPU Revolution — 30 Years of NVIDIA',
        short_name: 'GPU Revolution',
        description: 'A 3D scrollytelling journey through 30 years of NVIDIA GPU history',
        theme_color: '#030303',
        background_color: '#030303',
        display: 'standalone',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/assets\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'assets', expiration: { maxEntries: 50, maxAgeSeconds: 86400 * 30 } },
          },
        ],
      },
    }),
    isAnalyze && visualizer({ filename: 'dist/stats.html', open: true }),
    compress({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false }),
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
          if (id.includes('node_modules/three')) return 'vendor-r3f'
          if (id.includes('node_modules/@react-three')) return 'vendor-r3f'
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-helmet'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
