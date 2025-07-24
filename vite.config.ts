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
    // Prevent ANY assets from being inlined as data URIs (CSP compliance)
    assetsInlineLimit: 0,
    // Mobile-first performance optimizations
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // CRITICAL PATH OPTIMIZATION: Keep only essential items in main bundle
          
          // Core React libs - separate from vendor for better caching
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'react-core';
          }
          
          // Router - separate chunk for code splitting
          if (id.includes('react-router-dom')) {
            return 'routing';
          }
          
          // Supabase - heavy library, separate chunk
          if (id.includes('@supabase/supabase-js') ||
              id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          
          // Lucide icons - heavy UI library
          if (id.includes('lucide-react')) {
            return 'ui-icons';
          }
          
          // Form validation and utilities
          if (id.includes('node_modules/zod') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/class-variance-authority')) {
            return 'utils';
          }
          
          // Guide pages (330K chunk!)
          if (id.includes('/guides/')) {
            return 'guides';
          }
          
          // Heavy features (Quiz, Success, etc)
          if (id.includes('Quiz') || 
              id.includes('Success') ||
              id.includes('EarlyAccess') ||
              id.includes('Evaluation') ||
              id.includes('Support') ||
              id.includes('Explore')) {
            return 'heavy-features';
          }
          
          // Analytics and tracking
          if (id.includes('analytics') ||
              id.includes('monitoring') ||
              id.includes('tracking')) {
            return 'analytics';
          }
          
          // Charts and visualization
          if (id.includes('recharts') || 
              id.includes('chart') ||
              id.includes('visualization')) {
            return 'charts';
          }
          
          // Remaining vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Use hashed file names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Minify for production - CSP-friendly configuration
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Prevent aggressive inlining that creates data URIs
        inline: false,
        reduce_funcs: false
      },
      format: {
        // Prevent script concatenation that causes CSP issues
        beautify: false,
        comments: false
      }
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Ultra-aggressive chunk size limits for 90+ PageSpeed
    chunkSizeWarningLimit: 250, // Target: No single chunk >250KB
    reportCompressedSize: true,
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Performance optimizations
  server: {
  },
  // Image optimization hints
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.webp'],
  
  // Ensure proper React resolution
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    force: true
  },

  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'supabase/',
        'src/lib/supabase.ts', // External service
        'src/main.tsx', // App entry point
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});