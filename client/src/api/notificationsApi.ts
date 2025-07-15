import axios from 'axios'
import { NotificationType } from "../utils/NotificationType"
import axiosClient from "./client"
type AxiosRequestConfig = typeof axios.defaults

type fetchNotificationsResponse = {
  notifications: any
}

type readNotificationResponse = {
  updatedNotification: any
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
const fetchNotifications = async (
  userId: string,
  classId: string,
  notificationType: NotificationType | null
) => {
  try {
    let options: AxiosRequestConfig = { 
      headers: { 
        common: { 'Content-Type': 'application/json' },
        patch: {},
        post: {},
        put: {}
      },
      withCredentials: true 
    }
    if (notificationType) {
      options = { ...options, params: { notificationType } }
    }
    const response = await axiosClient.get<fetchNotificationsResponse>(
      `/api/${userId}/class/${classId}/notifications`,
      options
    )
    return response.data.notifications
  } catch (error) {
    console.error(error)
  }
}

/**
 * This function is used to make the call that marks the notification as read,
 * which visually updates the item to not be in bold.
 * 
 * @param userId - The id of the user clicking the notification.
 * @param classId - The class the notification belongs to.
 * @param notificationId - The id of the notification clicked.
 * @returns A boolean with the status if the notification is now read.
 */
const readNotification = async (
  userId: string,
  classId: string,
  notificationId: string
) => {
  try {
    const response = await axiosClient.put<readNotificationResponse>(
      `/api/${userId}/class/${classId}/notifications/${notificationId}`,
      {},
      { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    const markedRead = response.data.updatedNotification !== null ? true : false
    console.log(response)
    return markedRead
  } catch (error) {
    console.error(error)
  }
}

const notificationsApi = {
  fetchNotifications,
  readNotification
}

export default notificationsApi