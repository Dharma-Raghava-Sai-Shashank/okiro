import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function devApiPlugin() {
  return {
    name: 'tracker-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        try {
          const path = req.url.split('?')[0]
          if (path === '/api/tasks') {
            const mod = await server.ssrLoadModule('/api/tasks.js')
            return mod.default(req, res)
          }
          const idMatch = path.match(/^\/api\/tasks\/([^/]+)$/)
          if (idMatch) {
            req.query = { ...(req.query || {}), id: idMatch[1] }
            const mod = await server.ssrLoadModule('/api/tasks/[id].js')
            return mod.default(req, res)
          }
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Not found' }))
        } catch (err) {
          console.error('[dev-api]', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message || 'Server error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of Object.keys(env)) {
    if (process.env[key] === undefined) process.env[key] = env[key]
  }
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    server: { port: 5173 },
  }
})
