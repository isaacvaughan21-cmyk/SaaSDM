import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// On GitHub Pages the site is served under /SaaSDM/; locally it stays at /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/SaaSDM/' : '/',
  plugins: [react(), tailwindcss()],
}))
