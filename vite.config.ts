import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { vitePrerenderPlugin } from "vite-prerender-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Only prerender on production builds to keep dev server fast
    mode === "production" &&
      vitePrerenderPlugin({
        // The DOM element where React mounts
        renderTarget: "#root",
        // The prerender script with the routes list and render function
        prerenderScript: path.resolve(__dirname, "src/prerender.tsx"),
        // Extra routes not linked from the main page
        additionalPrerenderRoutes: ["/blog", "/gerador-documentos"],
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Fixed CSS filename so index.html can preload it statically
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/styles.css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
}));

