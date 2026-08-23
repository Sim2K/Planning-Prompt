import { defineConfig } from "vite";

declare const process: { env: Record<string, string | undefined> };

// Default stays 5173 (strict); the PORT env var lets a launcher assign a free port.
const devPort = Number(process.env.PORT) || 5173;

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        runtimeSemantics: "runtime-semantics.html",
        solutionsArchitect: "solutions-architect.html",
        support: "support.html",
        howToUse: "how-to-use.html",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: devPort,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});
