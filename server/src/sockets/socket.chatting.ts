import { Socket } from "socket.io"
import chattingServices from "../chatting/chatting.services"
import { prisma } from "../context/context"
import socketUtils from "./socket"

const ctx = { prisma }

/**
 * This functions uses the socket connection to receive messages from the client side,
 * store them to the class chat, and emits the message to all connected users.
 * 
 * @param socket - The socket IO server.
 */
const receiveMessage = (socket: Socket) => {
  const io = socketUtils.fetchIO()
  socket.on('message', async (senderId, classChatId, command, data) => {
    const message = await chattingServices.createNewChat(
      senderId,
      classChatId,
      command,
      data,
      ctx
    )
    const participants = await chattingServices.fetchAllParticipants(
      classChatId,
      ctx
    )
    if (participants) {
      for (const receiver of participants) {
        if (io && receiver.socketId) {
          io.to(receiver.socketId).emit('newMessage',
            message
        )}
      }
    }
  })
}

const socketChatting = {
  receiveMessage
}

export default socketChatting