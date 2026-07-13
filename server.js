import { createClient } from '@libsql/client'
import http from 'http'
import dotenv from 'dotenv'

dotenv.config()

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./app.sqlite',
  authToken: process.env.TURSO_AUTH_TOKEN
})

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
        if (req.url === '/users' && req.method === 'GET') {
            const result = await db.execute('SELECT id, name, password FROM users')
            return res.end(JSON.stringify(result.rows))
        }

        if (req.url === '/sums' && req.method === 'GET') {
            const result = await db.execute('SELECT id, a, b, sum, created_at, user_id FROM sums')
            return res.end(JSON.stringify(result.rows))
        }

        if (req.url === '/health' && req.method === 'GET') {
            return res.end(JSON.stringify({ status: 'ok' }))
        }

        res.statusCode = 404
        res.end(JSON.stringify({ error: 'Not found' }))
    } catch (error) {
        console.error('Database query error:', error)
        res.statusCode = 500
        res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }))
    }
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default server