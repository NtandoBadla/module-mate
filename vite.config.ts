import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      TanStackRouterVite({ routesDirectory: "./src/routes", generatedRouteTree: "./src/routeTree.gen.ts" }),
      react(),
      tailwindcss(),
      tsconfigPaths(),
    ],
    optimizeDeps: {
      force: true,
    },
    server: {
      proxy: {
        "/api/chat": {
          target: "https://integrate.api.nvidia.com",
          changeOrigin: true,
          rewrite: () => "/v1/chat/completions",
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Authorization", `Bearer ${env.VITE_NVIDIA_API_KEY}`);
              proxyReq.setHeader("Content-Type", "application/json");
            });
          },
        },
      },
    },
  };
});
