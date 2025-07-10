import type { NotificationType } from "../utils/NotificationType"
import axiosClient from "./client"

type fetchNotificationsPerCategoryResponse = {
  notifications: any
}

/**
 * This funciton fetches all the notifications for the specified category
 * for the user in the specific class provided. It returns a list where
 * every entry is a notification object.
 * 
 * @param userId - The user fetching notifcations as a receiver.
 * @param classId - The class these notifications belong to.
 * @param notificationType - The category these notifications fall into.
 */
const fetchNotificationsPerCategoryForUser = async (
  userId: string,
  classId: string,
  notificationType: NotificationType
) => {
  try {
    const response = await axiosClient.get<fetchNotificationsPerCategoryResponse>(
      `/api/${userId}/class/${classId}/notifications`,
      { 
        params: { notificationType },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    return response.data.notifications
  } catch (error) {
    console.error(error)
  }
}

const notificationsApi = {
  fetchNotificationsPerCategoryForUser
}

export default notificationsApi