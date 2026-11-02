import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// The site is served from https://alicewang453.github.io/16waves/
export default defineConfig({
  base: '/16waves/',
  plugins: [react()],
})
