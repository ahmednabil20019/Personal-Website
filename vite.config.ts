import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig, ViteDevServer } from "vite"
import { createApiServer } from "./server"

const apiServerPlugin = () => ({
  name: 'api-server-plugin',
  configureServer: (server: ViteDevServer) => {
    const api = createApiServer();
    server.middlewares.use('/api', api);
  }
});

export default defineConfig({
  envDir: './', // Use the root directory for .env files
  plugins: [
    react(),
    apiServerPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
