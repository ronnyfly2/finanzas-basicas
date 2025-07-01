import { defineConfig } from 'vite'
import path from 'path' // Necesario para resolve.alias
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1300, // Increased limit to 1300KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group Fort Awesome into its own chunk
            if (id.includes('@fortawesome')) {
              return '@fortawesome';
            }
            // Group Chart.js and related dependencies
            if (id.includes('chart.js') || id.includes('@kurkle') || id.includes('chartjs-adapter-date-fns')) {
              return 'chart';
            }
            // General vendor chunk
            return 'vendor'; 
          }
          // Group view components into their own chunks by name
          if (id.includes('src/views/')) {
            return id.toString().split('src/views/')[1].split('.')[0];
          }
        }
      }
    }
  },
})
