import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: "./src/routes", generatedRouteTree: "./src/routeTree.gen.ts" }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      "/api/chat": {
        target: "https://integrate.api.nvidia.com/v1/chat/completions",
        changeOrigin: true,
        rewrite: () => "",
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            const key = process.env.VITE_NVIDIA_API_KEY ?? "";
            proxyReq.setHeader("Authorization", `Bearer ${key}`);
            proxyReq.setHeader("Content-Type", "application/json");
          });
        },
      },
    },
  },
});
