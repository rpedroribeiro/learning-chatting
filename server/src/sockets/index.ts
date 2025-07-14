import { Server as SocketIOServer, Socket } from "socket.io"
import socketUtils from "./socket"

/**
 * This function sets up the socket io server and logs when a user
 * connects and disconnects.
 * 
 * @param io - The socket io server instance created in the server
 */
const setUpSocketServer = async (io: SocketIOServer): Promise<void> => {
  socketUtils.initializeSocket(io)
  io.disconnectSockets()

  io.on('connection', (socket) => {
    console.log('A user connected')
    
    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })
}

export default setUpSocketServer