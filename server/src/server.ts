import app from './app'
import http from 'http'
import setUpSocketServer from './sockets'
import { Server as SocketIOServer } from 'socket.io'

const startServer = async () => {
  const server = http.createServer(app)
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    }
  })

  setUpSocketServer(io)

  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer().catch((err) => {
  console.error('Error starting the server', err)
})