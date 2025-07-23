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
          // Keep React in main vendor bundle to ensure proper loading order
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          
          // Route related chunks
          if (id.includes('react-router-dom')) {
            return 'routing';
          }
          
          // Heavy external libraries
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          
          // Guide pages (large components)
          if (id.includes('/guides/')) {
            return 'guides';
          }
          
          // Quiz and other heavy features
          if (id.includes('Quiz') || 
              id.includes('EarlyAccess') ||
              id.includes('Evaluation')) {
            return 'heavy-features';
          }
          
          // Icons and UI libraries - split into smaller chunks
          if (id.includes('lucide-react')) {
            return 'ui-icons';
          }
          
          // Charts and heavy UI components
          if (id.includes('recharts') || id.includes('chart')) {
            return 'charts';
          }
          
          // Default vendor chunk for other node_modules
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
    // Optimize chunk size for mobile performance
    chunkSizeWarningLimit: 500, // Reduced from 1000kb for better mobile performance
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