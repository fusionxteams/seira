import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isGhPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGhPages ? '/seira/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'prefix-public-images',
      transform(code, id) {
        if (isGhPages && /\.(tsx?|jsx?)$/.test(id)) {
          return code.replace(/(["'])\/images\//g, '$1/seira/images/')
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
