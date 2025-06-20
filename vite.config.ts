import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/socket.io": {
        target: process.env.VITE_API_URL! ,
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
  preview: {
    allowedHosts: ["dragonblood.onrender.com"],
  },
});
