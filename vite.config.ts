import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deployment base path
  base: process.env.GITHUB_PAGES === 'true' ? '/Hoopland_save_editor/' : '/',
})
