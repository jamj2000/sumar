import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config()

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./app.sqlite',
  authToken: process.env.TURSO_AUTH_TOKEN
})

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.statusCode = 200
        return res.end()
    }

    try {
        // Parse the pathname from req.url
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
        const pathname = url.pathname

        if (pathname === '/users' && req.method === 'GET') {
            const result = await db.execute('SELECT id, name, password FROM users')
            return res.end(JSON.stringify(result.rows))
        }

        if (pathname === '/sums' && req.method === 'GET') {
            const result = await db.execute('SELECT id, a, b, sum, created_at, user_id FROM sums')
            return res.end(JSON.stringify(result.rows))
        }

        if (pathname === '/health' && req.method === 'GET') {
            return res.end(JSON.stringify({ status: 'ok' }))
        }

        res.statusCode = 404
        res.end(JSON.stringify({ error: 'Not found', pathname }))
    } catch (error) {
        console.error('Database query error:', error)
        res.statusCode = 500
        res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }))
    }
}
