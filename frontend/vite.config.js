import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: path.join(__dirname, '../backend/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(__dirname, 'index.html')
    }
  }
})
