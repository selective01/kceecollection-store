// vite.config.ts — optimized build configuration
// Key changes:
// 1. resolve.alias maps @/ to src/ (fixes "Cannot find module '@/...'" errors)
// 2. manualChunks splits vendor libraries into separate cached files
// 3. assetsInlineLimit keeps small assets inline (saves HTTP requests)
// 4. target ES2020 for modern browsers (smaller output)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Target modern browsers — smaller, faster output
    target: "es2020",

    // Warn if any single chunk exceeds 600KB
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate cached chunks
        // These don't change between deploys so browsers cache them indefinitely
        manualChunks: {
          // React core — changes rarely
          "vendor-react": ["react", "react-dom", "react-router-dom"],

          // Chart library — only loaded on admin sales/dashboard pages
          "vendor-charts": ["recharts"],

          // Icon library — split from main bundle
          "vendor-icons": ["@fortawesome/fontawesome-free"],
        },
      },
    },

    // Inline assets smaller than 4KB (avoids extra HTTP requests for tiny images/svgs)
    assetsInlineLimit: 4096,
  },

  // Faster dev server startup
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
