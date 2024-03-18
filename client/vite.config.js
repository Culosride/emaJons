import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying API requests
      '/api': {
        // target: 'http://server:3000',
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
