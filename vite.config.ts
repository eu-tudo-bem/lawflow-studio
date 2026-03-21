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
    // Prerender apenas em builds de produção (não impacta o dev server)
    mode === "production" &&
      vitePrerenderPlugin({
        // Seletor do elemento onde o React monta no index.html
        renderTarget: "#root",
        // Script com a função prerender() exportada
        prerenderScript: path.resolve(__dirname, "src/prerender.tsx"),
        // Rotas extras não acessíveis via link interno do "/"
        additionalPrerenderRoutes: [
          "/blog",
          "/gerador-documentos",
          "/calculadora",
          "/pensao-alimenticia",
          "/divorcio-consensual",
          "/cobranca-aluguel",
          "/direito-agrario",
          "/transferencia-veiculos",
          "/recuperacao-veiculos",
          "/defesa-agraria",
          "/naturalizacao",
          "/execucao-pensao",
          "/reabilitacao-criminal",
          "/simulador-pensao",
          "/simulador-juros",
          "/simulador-aposentadoria",
          "/simulador-horas-extras",
        ],
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

