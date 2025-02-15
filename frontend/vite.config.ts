import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "DinDin",
        short_name: "DinDin",
        description: "Track your money",
        theme_color: "#080e12",
        background_color: "#080e12",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        
      },

      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
  server: {
    port: parseInt(process.env.PORT || "5173"),
    host: "0.0.0.0"
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
