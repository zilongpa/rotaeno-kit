import react from '@vitejs/plugin-react'
import path from 'node:path'
import unpluginIcons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import viteSitemapPlugin from './src/build/vite-sitemap-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    unpluginIcons({ compiler: 'jsx', jsx: 'react', autoInstall: true }),
    viteSitemapPlugin({ routes: ['https://rotaeno.imgg.dev/'] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
