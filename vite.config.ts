import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error - plugin has no typed declarations
import { visualizer } from 'rollup-plugin-visualizer';
// @ts-expect-error - plugin has no typed declarations
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  // Configure base path - keep root for now since we're handling routing in React
  base: '/',
  
  plugins: [
    react(),
    // Generates bundle analysis at build/dist
    visualizer({ filename: 'dist/bundle-analysis.html', open: false, gzipSize: true, brotliSize: true }),
    // Output gzip and brotli compressed assets ready for hosting
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
  ],

  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react']
        },
        // Use hashed file names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Performance optimizations
  server: {
  },
  // Image optimization hints
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.webp'],
});