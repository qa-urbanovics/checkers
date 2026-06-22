import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isWebDeploy = process.env.BUILD_TARGET === 'web';

export default defineConfig({
  plugins: [react()],
  // Web deploy: absolute base for GitHub Pages
  // iOS build: relative './' for Capacitor file:// loading
  base: isWebDeploy ? '/checkers/' : './',
  build: {
    outDir: isWebDeploy ? 'docs' : 'dist',
    emptyOutDir: false, // never wipe docs/ (contains privacy/)
  },
})
