import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base แบบ relative เพื่อให้ deploy ใต้ subpath ได้ (เช่น GitHub Pages)
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
