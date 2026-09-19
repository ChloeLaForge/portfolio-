import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Serves /api/* from the same Express code that runs in production, so
 * `npm run dev` needs no second process. Server-only values from .env
 * (like OPENAI_API_KEY) are loaded into the dev server's process, never
 * into the browser bundle.
 */
function assistantApi(): Plugin {
  return {
    name: 'assistant-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const key of ['OPENAI_API_KEY', 'OPENAI_MODEL', 'DATABASE_URL', 'ANALYTICS_ADMIN_KEY']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()
        try {
          const { createApiApp } = await server.ssrLoadModule('/server/app.ts')
          createApiApp()(req, res, next)
        } catch (err) {
          next(err)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), assistantApi()],
  server: { port: 5173, open: true },
})
