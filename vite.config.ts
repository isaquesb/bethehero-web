import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTA Vite 8: usa rolldownOptions, não rollupOptions (breaking change do Vite 8)
export default defineConfig({
  plugins: [react()],
  // sem rolldownOptions necessário para este projeto — sem customização avançada de build
})
