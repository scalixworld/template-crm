import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import scalixComponentTagger from '@scalix-world/react-vite-component-tagger'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), scalixComponentTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
