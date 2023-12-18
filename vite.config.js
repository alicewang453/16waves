import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/16waves",
  plugins: [react([
    'react-wavepact/src/main.jsx'
  ])],
})
