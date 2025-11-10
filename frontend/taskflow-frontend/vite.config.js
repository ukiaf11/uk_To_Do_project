import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Yeh line fix karegi error
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },
})