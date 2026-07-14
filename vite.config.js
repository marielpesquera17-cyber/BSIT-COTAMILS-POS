import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react({
      // Enable fast refresh and JSX optimization
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // ── Dev proxy ──────────────────────────────────────────────────────────
  // All requests to /api/* are forwarded to the Vercel backend by the Vite
  // dev server. The browser only ever talks to localhost:5173, so the
  // httpOnly "token" cookie is a FIRST-PARTY cookie and is stored/sent
  // normally. This fixes the 401 "No token provided" errors and the
  // logout-on-refresh problem in development.
  server: {
    proxy: {
      '/api': {
        target: 'https://bsit-cotamils-pos-server.vercel.app',
        changeOrigin: true,
        secure: true,
        // Strip any Domain=... attribute the backend might set on the
        // cookie so it attaches to localhost instead of vercel.app
        cookieDomainRewrite: '',
      },
    },
  },

  assetsInclude: ['*/.svg', '*/.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production for smaller size
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
})