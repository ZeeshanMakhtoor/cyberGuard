import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Fully separate build pipeline for the marketing landing page, kept
 * independent from vite.config.ts (which builds the dashboard app) so the
 * two can be deployed as two different Vercel projects — dashboard on the
 * root domain, landing on a subdomain — without either build affecting the
 * other. `root: 'landing'` makes landing/index.html the sole entry, and the
 * output is a plain dist-landing/index.html Vercel can serve as-is.
 */
export default defineConfig({
  root: path.resolve(__dirname, 'landing'),
  base: '/',
  // Vite resolves .env* files relative to `root` by default, but our .env
  // files live at the repo root (shared with the dashboard's own Supabase
  // config) — point envDir back there so VITE_SUPABASE_* is still picked up.
  envDir: path.resolve(__dirname, '.'),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist-landing'),
    emptyOutDir: true,
  },
})
