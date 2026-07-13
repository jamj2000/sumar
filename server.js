import http from 'http'
import handler from './api/index.js'

const server = http.createServer(handler)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

export default server