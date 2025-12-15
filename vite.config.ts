import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Remove whitespace in production
          whitespace: 'condense',
        },
      },
    }),
    vueJsx(),
    vueDevTools(),
    // Vuetify auto-import with tree-shaking
    vuetify({
      autoImport: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 9999
  },
  build: {
    // Target modern browsers for smaller bundle
    target: 'es2015',

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 600,

    // Use esbuild for minification (faster than terser, built-in)
    minify: 'esbuild',

    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'vuetify-vendor': ['vuetify'],
          'supabase-vendor': ['@supabase/supabase-js'],

          // Component chunks
          'dashboard-components': [
            './src/components/dashboard/MoneyBookSelector.vue',
            './src/components/dashboard/PocketsManager.vue',
            './src/components/dashboard/AllocationsHistory.vue',
            './src/components/dashboard/AllocationDialog.vue',
          ],
        },

        // Asset file names
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]'

          const info = assetInfo.name.split('.')
          let extType = info[info.length - 1]

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
            extType = 'images'
          } else if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            extType = 'fonts'
          }

          return `assets/${extType}/[name]-[hash][extname]`
        },

        // Chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
})
