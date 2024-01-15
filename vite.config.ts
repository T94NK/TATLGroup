import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/TATLGroup/',
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  plugins: [react()],
})
