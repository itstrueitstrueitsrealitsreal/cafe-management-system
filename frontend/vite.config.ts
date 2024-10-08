import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Proxy requests to `/api` to the backend server
      "/api": {
        target: "http://localhost:3000", // The backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: If the backend doesn't need the `/api` prefix
      },
    },
  },
});
