import { Server as SocketIOServer, Socket } from "socket.io"

/**
 * This function sets up the socket io server and creates all the events
 * it is listening for.
 * 
 * @param io - The socket io server instance created in the server
 */
const setUpSocketServer = async (io: SocketIOServer): Promise<void> => {
  io.disconnectSockets()

  io.on('connection', (socket) => {
    console.log('A user connected')
    
    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })
}

export default setUpSocketServer