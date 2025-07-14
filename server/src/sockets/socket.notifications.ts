import { NotificationType } from "@prisma/client"
import socketUtils from "./socket"

/**
 * This function loops through all receivers and emits the socket
 * call with all the necessary information.
 * 
 * @param classId - The class the notification belongs to.
 * @param notificationType - The category of the notification.
 * @param data - All the dat from the notification.
 * @param receivers - Used to find the socket.id of the receivers.
 */
const sendNotificationToReceivers = async (
  classId: string,
  notificationType: NotificationType,
  data: any,
  receivers: any[]
) => {
  const io = socketUtils.fetchIO()
  for (const receiver of receivers) {
    if (io && receiver.socketId) {
      io.to(receiver.socketId).emit('notificationPosted',
        classId,
        notificationType,
        data
    )}
  }
}

const socketNotifications = {
  sendNotificationToReceivers
}

export default socketNotifications