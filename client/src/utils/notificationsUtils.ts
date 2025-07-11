import { NotificationType } from "./NotificationType"

/**
 * This function takes in the notification category and the notification item and
 * formats the notification message and the time since it was posted.
 * 
 * @param notificationItem - The notification item that will be formatted.
 * @param notificationType - The category of the notification.
 * @returns 
 */
const formatNotificationItem = (
  notificationItem: any,
  notificationType: NotificationType
) => {
  const notificationTime = new Date(notificationItem.createdAt)
  const currTime = new Date()
  const differenceInSeconds = Math.round((currTime.getTime() - notificationTime.getTime()) / 1000)
  const formattedTimeDifference = formatTimeDifference(differenceInSeconds)

  switch (notificationType) {
    case NotificationType.AnnouncementPosted:
      return [`${notificationItem.data.announcementTitle}`, formattedTimeDifference]
    case NotificationType.AssignmentPosted:
      return [`${notificationItem.data.name} was assigned`, formattedTimeDifference]
    case NotificationType.FileSystemItemCreated:
      return [`${notificationItem.data.name} was uploaded`, formattedTimeDifference]
    case NotificationType.StudentSubmission:
      return [`${notificationItem.data.student.firstName} ${notificationItem.data.student.firstName} 
      submitted assignment ${notificationItem.data.assignment.name}`, formattedTimeDifference]
  }
}

/**
 * This function formats the time differnce so it shows whole numbers either seconds,
 * minutes, hours, or days since the notification has been posted.
 * 
 * @param differenceInSeconds - The time difference from now since the notification was
 * posted in seconds.
 * @returns - The newly formatted difference.
 */
const formatTimeDifference = (differenceInSeconds: number) => {
  if (differenceInSeconds < 60) return differenceInSeconds + 's'
  if (differenceInSeconds < 3600) return Math.round(differenceInSeconds / 60) + 'm'
  if (differenceInSeconds < 86400) return Math.round(differenceInSeconds / 3600) + 'h'
  return Math.round(differenceInSeconds / 86400) + 'd'
}

const notificationsUtils = {
  formatNotificationItem
}

export default notificationsUtils