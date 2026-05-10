// Production-mode local server: serves dist/ + mounts the /api/* handlers.
// Run after `npm run build` (or use ./run-prod.sh which does both).

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, extname, join, normalize } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Load .env.local manually so MONGODB_URI etc. are available.
const envFile = resolve(__dirname, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

const DIST = resolve(__dirname, 'dist')
const PORT = Number(process.env.PORT) || 4173
const HOST = process.env.HOST || 'localhost'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
}

async function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0])
  if (urlPath === '/') urlPath = '/index.html'

  let filePath = normalize(join(DIST, urlPath))
  if (!filePath.startsWith(DIST)) {
    res.statusCode = 403
    res.end('Forbidden')
    return
  }

  // SPA fallback: any non-existent path that isn't an asset → index.html
  if (!existsSync(filePath)) {
    filePath = join(DIST, 'index.html')
  }

  try {
    const data = await readFile(filePath)
    res.setHeader(
      'Content-Type',
      MIME[extname(filePath)] || 'application/octet-stream',
    )
    if (extname(filePath) === '.html') {
      res.setHeader('Cache-Control', 'no-cache')
    } else if (urlPath.startsWith('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
    res.statusCode = 200
    res.end(data)
  } catch (err) {
    res.statusCode = 404
    res.end('Not found')
  }
}

async function importApi(relativePath) {
  // pathToFileURL handles brackets in [id].js correctly across platforms
  const abs = resolve(__dirname, relativePath)
  return import(pathToFileURL(abs).href)
}

const server = createServer(async (req, res) => {
  try {
    const path = req.url.split('?')[0]

    if (path === '/api/tasks') {
      const mod = await importApi('api/tasks.js')
      return mod.default(req, res)
    }

    const idMatch = path.match(/^\/api\/tasks\/([^/]+)$/)
    if (idMatch) {
      req.query = { ...(req.query || {}), id: idMatch[1] }
      const mod = await importApi('api/tasks/[id].js')
      return mod.default(req, res)
    }

    if (path.startsWith('/api/')) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Not found' }))
      return
    }

    return serveStatic(req, res)
  } catch (err) {
    console.error('[serve]', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err.message || 'Server error' }))
  }
})

if (!existsSync(DIST)) {
  console.error(
    '\n[serve] dist/ not found. Run `npm run build` first (or use ./run-prod.sh).\n',
  )
  process.exit(1)
}

server.listen(PORT, HOST, () => {
  console.log(`\n  🔥  Okiro running at http://${HOST}:${PORT}\n`)
})
