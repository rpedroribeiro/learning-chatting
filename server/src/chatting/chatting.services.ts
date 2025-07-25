import { send } from "process"
import { Context } from "../context/context"

/**
 * This function creates a new class chat and connects it to the class
 * provided with the id automatically due to how Prisma's ORM works.
 * 
 * @param classId - The class id of the class chat.
 * @param ctx - The prisma context that this function is being used in. 
 */
const createNewClassChat = async (
  classId: string,
  professorId: string,
  ctx: Context
) => {
  await ctx.prisma.classChat.create({
    data: {
      classId: classId,
      participants: {
        connect: { id: professorId }
      }
    }
  })
}

/**
 * This function creates a new chat using the sender id and the data that they
 * sent alongisde the request.
 * 
 * @param senderId - The id of the sender.
 * @param classChatId - The id of the classChat this chat belongs to.
 * @param command - A boolean that determines if this is a command bot response.
 * @param data - The data of the chat.
 * @param ctx - The prisma context that this function is being used in. 
 * @returns The new chat object created.
 */
const createNewChat = async (
  senderId: string,
  classChatId: string,
  command: boolean,
  data: any,
  ctx: Context
) => {
  return await ctx.prisma.chat.create({
    data: {
      classChatId: classChatId,
      senderId: senderId,
      command: command,
      content: !command && data,
      commandResponse: command && data
    }
  })
}

/**
 * This function fetches all the participants from a class chat to be used to broadcast
 * a new chat to all the connected users.
 * 
 * @param classChatId - The id of the clss chat to fetch the participants from.
 * @param ctx - The prisma context that this function is being used in. 
 * @returns The list of the participants.
 */
const fetchAllParticipants = async (
  classChatId: string,
  ctx: Context
) => {
  const classChat = await ctx.prisma.classChat.findUnique({
    where: {
      id: classChatId
    },
    select: {
      participants: true
    }
  })
  return classChat ? classChat.participants : null
}

/**
 * This function fetches all the class chat information, queries the class chat using the
 * provided class id.
 * 
 * @param classId - The id used to query the class chat.
 * @param ctx - The prisma context that this function is being used in. 
 * @returns The class chat object.
 */
const fetchClassChat = async (
  classId: string,
  ctx: Context
) => {
  return await ctx.prisma.classChat.findUnique({
    where: {
      classId: classId
    },
    include: {
      chats: true
    }
  })
}

const chattingServices = {
  createNewClassChat,
  createNewChat,
  fetchAllParticipants,
  fetchClassChat
}

export default chattingServices