// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "firebase/firestore": "firebase/firestore",
      "@": path.resolve(__dirname, "src"),
    },
  },
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: true,
    hmr: {
      overlay: true,
    },
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom"],

          // Router
          router: ["react-router-dom"],

          // Firebase
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],

          // UI/Styling libraries (adjust based on your actual dependencies)
          "ui-libs": ["tailwindcss"].filter((lib) => {
            try {
              require.resolve(lib);
              return true;
            } catch {
              return false;
            }
          }),

          // Utility libraries
          utils: ["lodash", "date-fns", "axios"].filter((lib) => {
            try {
              require.resolve(lib);
              return true;
            } catch {
              return false;
            }
          }),
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
