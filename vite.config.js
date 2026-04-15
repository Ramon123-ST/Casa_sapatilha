import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // O "./" faz o site funcionar em qualquer lugar (GitHub, Vercel ou Local)
  base: "./", 
})