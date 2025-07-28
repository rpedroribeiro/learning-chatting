import { Server as SocketIOServer, Socket } from "socket.io"
import socketUtils from "./socket"
import { prisma } from "../context/context"
import authServices from "../auth/auth.services"
import socketChatting from "./socket.chatting"

const ctx = { prisma }

/**
 * This function sets up the socket io server and logs when a user
 * connects and disconnects.
 * 
 * @param io - The socket io server instance created in the server
 */
const setUpSocketServer = async (io: SocketIOServer): Promise<void> => {
  socketUtils.initializeSocket(io)
  io.disconnectSockets()

  io.on('connection', async (socket) => {
    const userId = socket.handshake.auth.userId
    await authServices.addSocketIdToUser(
      userId,
      socket.id,
      ctx
    )

    socketChatting.receiveMessage(socket, userId)
    
    socket.on('disconnect', async () => {
      await authServices.removeSocketIdFromUser(
        userId,
        ctx
      )
    })
  })
}

export default setUpSocketServer