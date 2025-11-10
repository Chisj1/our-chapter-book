import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // --- ADDED PROXY CONFIGURATION ---
    proxy: {
      // Proxy all requests starting with '/api' to the backend server
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        // Rewrite to remove the '/api' prefix if the backend doesn't expect it
        // Since your backend handles routes starting with /api, we can omit rewrite.
      },
    }
    // ---------------------------------
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));