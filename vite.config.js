import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/AlgoPlusPlus/",
  plugins: [react()],
  server: {
    mimeTypes: {
      'application/wasm': ['wasm']
    }
  }
})
