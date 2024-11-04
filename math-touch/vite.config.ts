import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src/'),
      '@lib': path.resolve(__dirname, './src/lib/'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  server: {
    cors: {
      origin: '*',
    },
    host: true,
    strictPort: true,
    port: 8080,
  },
  plugins: [react()],
})