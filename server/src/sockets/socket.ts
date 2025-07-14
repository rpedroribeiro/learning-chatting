import { Server as SocketIOServer } from "socket.io"
let io: SocketIOServer | null = null

/**
 * This function instantiates the singleton instance of the IO server
 * to be used in anywhere in the server.
 * 
 * @param ioInstance - The IO instance initialized that will be
 * used to set the singleton.
 */
const initializeSocket = (ioInstance: SocketIOServer) => {
  io = ioInstance
}

/**
 * The function fetches the IO singleton initialized, logs an error
 * message if failed to return the instance.
 * 
 * @returns The singleton io to be used anywhere in the server
 */
const fetchIO = () => {
  if (!io) { console.error("IO instance does not exist") }
  return io
}

const socketUtils = {
  initializeSocket,
  fetchIO
}

export default socketUtils