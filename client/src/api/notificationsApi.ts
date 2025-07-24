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

type createAnnoucementResponse = {
  annoucement: any
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

/**
 * This function sends a POST request to create an annoucement using the data gathered
 * from the announcement modal. Returns the status of the request alongside an error
 * message if necessary.
 * 
 * @param userId - The id of the professor creating the announcement.
 * @param classId - The id of the class the annoucement corresponds to.
 * @param annoucementTitle - The desired title of the annoucement.
 * @param annoucementDescription - The desired description of the annoucement.
 * @returns The status of the response and a message with an error if necessary.
 */
const createAnnouncement = async (
  userId: string,
  classId: string,
  announcementTitle: string,
  announcementDescription: string
): Promise<[boolean, string]> => {
  try {
    const response = await axiosClient.post<createAnnoucementResponse>(
      `/api/${userId}/class/${classId}/notifications/announcement`,
      { announcementTitle, announcementDescription },
      { headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
      }
    )
    if (response.data.annoucement) { return [true, ""] }
    return [false, "Could not create annoucement"]
  } catch (error) {
    console.error(error)
    return [false, "Could not create annoucement"]
  }
}

const notificationsApi = {
  fetchNotifications,
  readNotification,
  createAnnouncement
}

export default notificationsApi