import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          try {
            const mod = await server.ssrLoadModule('/server/index.ts');
            return mod.app(req, res, next);
          } catch (err) {
            return next(err);
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), expressApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
