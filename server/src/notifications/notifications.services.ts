import { NotificationType, User } from "@prisma/client"
import { Context } from "../context/context"

/**
 * This function creates a notification for a specific category for all
 * receivers listed, this will only show up on the class of the class id
 * that has been provided.
 * 
 * @param userId - The id of the user creating the notification.
 * @param classId - The classId of the notification.
 * @param notificationType - The category of notification.
 * @param data - The metadata needed for the notification.
 * @param receivers - All users receiving the notification.
 * @param ctx - The prisma context that this function is being used in.
 */
const createNotification = async (
  userId: string,
  classId: string,
  notificationType: NotificationType,
  data: any,
  receivers: User[],
  ctx: Context
) => {
  try {
    for (const receiver of receivers) {
      await ctx.prisma.notification.create({
        data: {
          classId: classId,
          creatorId: userId,
          receiverId: receiver.id,
          type: notificationType,
          data: data
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * This functions fetches all the notifications for a user in a
 * specific class for a specific category provided, it returns a list
 * of all the notifications.
 * 
 * @param userId - The id of the receiver of these notifications.
 * @param notificationType - The category of notification being fetched.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - A list of all the notifications for the user in the specified
 * category.
 */
const getAllNotificationsForCategoryForUser = async (
  userId: string,
  classId: string,
  notificationType: NotificationType,
  ctx: Context
) => {
  try {
    return await ctx.prisma.notification.findMany({
      where: {
        receiverId: userId,
        classId: classId,
        type: notificationType
      }
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * This function marks the specified notification as read, it then returns
 * the updated status of the notification.
 * 
 * @param notificationId - The id of the notification being marked as read.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The updated state of the read notification.
 */
const markNotificationAsRead = async (
  notificationId: string,
  ctx: Context
) => {
  try {
    return await ctx.prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const notificationServices = {
  createNotification,
  getAllNotificationsForCategoryForUser,
  markNotificationAsRead
}

export default notificationServices