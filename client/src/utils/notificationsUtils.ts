import { NotificationType } from "./NotificationType"

type WidgetInfo = {
  name: string;
  type: NotificationType;
  weight: number;
}

const studentWidgets: WidgetInfo[] = [
  { name: "File System Updates", type: NotificationType.FileSystemItemCreated, weight: 1 },
  { name: "Assignments", type: NotificationType.AssignmentPosted, weight: 2 },
  { name: "Announcements", type: NotificationType.AnnouncementPosted, weight: 3 }
]

const professorWidgets: WidgetInfo[] = [
  { name: "Submissions", type: NotificationType.StudentSubmission, weight: 1}
]

type scoreArray = {
  unreadCount: number,
  unreadHours: number
}

/**
 * Alpha is the weight for the number of notifications unread, Beta is the number of
 * hours the unread notifications have been unread.
 */
const alpha = 2
const beta = 1

/**
 * This function takes in the notification category and the notification item and
 * formats the notification message and the time since it was posted.
 * 
 * @param notificationItem - The notification item that will be formatted.
 * @param notificationType - The category of the notification.
 * @returns - The notification message and the time since posted.
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
      return [`${notificationItem.data.submissions[0].student.firstName} ${notificationItem.data.submissions[0].student.lastName} 
      submitted the following assignment:  ${notificationItem.data.name}`, formattedTimeDifference]
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

/**
 * This function handles the navigation to all different types of notifications when
 * clicked.
 * 
 * @param notificationType - The category used to determine what url to use.
 * @param userId - The id of the user logged in.
 * @param classId - The class the notification id belongs to.
 * @param assignmentId - The assignment id the notification belongs to, optional.
 * @returns The url to be used to navigate.
 */
const navigateToNotification = (
  notificationType: NotificationType,
  userId: string,
  classId: string,
  assignmentId: string | null
): string => {
  switch (notificationType) {
    case NotificationType.AnnouncementPosted:
      // TODO: Make the annoucement section, possible new page or modal popup
      return ""
    case NotificationType.AssignmentPosted:
      return `/${userId}/classrooms/${classId}/assignments/${assignmentId}`
    case NotificationType.FileSystemItemCreated:
      return `/${userId}/classrooms/${classId}/files`
    case NotificationType.StudentSubmission:
      return `/${userId}/classrooms/${classId}/assignments/${assignmentId}/submissions`
  }
}

/**
 * Formats the notification message to appear on the notification banner.
 * 
 * @param notificationData - The data needed for the correct message to be displayed.
 * @param notificationType - The notification category that is used in this function's
 * switch case.
 * @returns The new message to be displayed in the banner.
 */
const formatNotificationMessage = (
  notificationData: any,
  notificationType: NotificationType,
) => {
  switch (notificationType) {
    case NotificationType.AnnouncementPosted:
      return `${notificationData.announcementTitle}`
    case NotificationType.AssignmentPosted:
      return `${notificationData.name} was assigned`
    case NotificationType.FileSystemItemCreated:
      return `${notificationData.name} was uploaded`
    case NotificationType.StudentSubmission:
      return `${notificationData.submissions[0].student.firstName} ${notificationData.submissions[0].student.lastName} 
      submitted the following assignment: ${notificationData.name}`
  }
}

/**
 * This function takes in all the notifications fetched and counts the number of 
 * unread  notifications and how many hours they have been unread for each of the 
 * different student categories.
 * 
 * @param notifications - All the notifications fetched.
 * @returns A map with all the count data and the notification type as the key.
 */
const sortStudentWidgets = (
  notifications: any
) => {
  let announcementNotifications: scoreArray = { unreadCount: 0, unreadHours: 0 }
  let assignmentNotifications: scoreArray = { unreadCount: 0, unreadHours: 0 }
  let fileSystemNotifications: scoreArray = { unreadCount: 0, unreadHours: 0 }
  for (const notification of notifications) {
    switch (notification.type) {
      case NotificationType.AnnouncementPosted:
        if (!notification.read) {
          announcementNotifications.unreadCount++
          announcementNotifications.unreadHours += Math.round(
            new Date(notification.createdAt).getTime() / 3600000
          )
        }
        break
      case NotificationType.AssignmentPosted:
        if (!notification.read) {
          assignmentNotifications.unreadCount++
          assignmentNotifications.unreadHours += Math.round(
            new Date(notification.createdAt).getTime() / 3600000
          )
        }
        break
      case NotificationType.FileSystemItemCreated:
        if (!notification.read) {
          fileSystemNotifications.unreadCount++
          fileSystemNotifications.unreadHours += Math.round(
            new Date(notification.createdAt).getTime() / 3600000
          )
        }
        break
    }
  }

  return new Map<NotificationType, scoreArray>([
    [NotificationType.AnnouncementPosted, { 
      unreadCount: announcementNotifications.unreadCount, 
      unreadHours:announcementNotifications.unreadHours }
    ],
    [NotificationType.AssignmentPosted, {
      unreadCount: assignmentNotifications.unreadCount,
      unreadHours: assignmentNotifications.unreadHours
    }],
    [NotificationType.FileSystemItemCreated, { 
      unreadCount: fileSystemNotifications.unreadCount,
      unreadHours: fileSystemNotifications.unreadHours 
    }],
  ])
}

/**
 * This function gets the total notification count for each one of notification
 * categories, used as a secondary sorting method.
 * 
 * @param notifications - All notifications for a user.
 * @returns A map with the counts for each notification type.
 */
const getTotalNotificationCounts = (notifications: any[]): Map<NotificationType, number> => {
  const counts = new Map<NotificationType, number>()
  for (const notification of notifications) {
    counts.set(
      notification.type,
      (counts.get(notification.type) || 0) + 1
    )
  }
  return counts
}

/**
 * This function takes in all the data saved into the map and sorts the
 * widgets, it then returns the widget name and type.
 * @param unreadData - The data stored in the map from all the fetched
 * notifications
 * @param widgets - The types of widgets being use, student or professor.
 * @returns The widget name and type in an array.
 */
const sortWidgetsByScore = (
  unreadData: Map<NotificationType, scoreArray>,
  widgets: WidgetInfo[],
  totalCounts: Map<NotificationType, number>
): [string, NotificationType][] => {
  return widgets
    .map(widget => {
      const stats = unreadData.get(widget.type) || { unreadCount: 0, unreadHours: 0 }
      const score =
        widget.weight *
        (1 + alpha * stats.unreadCount) *
        (1 + beta * stats.unreadHours)
      return { widget, score, stats }
    })
    .sort((a, b) => {
      const aNoUnread = a.score === a.widget.weight
      const bNoUnread = b.score === b.widget.weight
      if (aNoUnread && bNoUnread) {
        const aTotal = totalCounts.get(a.widget.type) || 0
        const bTotal = totalCounts.get(b.widget.type) || 0
        return bTotal - aTotal
      }
      return b.score - a.score
    })
    .map(({ widget }) => [widget.name, widget.type] as [string, NotificationType])
}

/**
 * This function takes in the notifications to be sorted for the student and runs 
 * functions to get the notification data to sort and then sorts the notification 
 * categories.
 * 
 * @param notifications - The notifications that decide the category sorting.
 * @returns The widget name and type in a sorted list.
 */
const fetchedOrderStudentWidgets = (notifications: any) => {
  const notificationsData: Map<NotificationType, scoreArray> = sortStudentWidgets(notifications)
  const totalCounts = getTotalNotificationCounts(notifications)
  return sortWidgetsByScore(
    notificationsData,
    studentWidgets,
    totalCounts
  )
}

const notificationsUtils = {
  formatNotificationItem,
  navigateToNotification,
  fetchedOrderStudentWidgets,
  formatNotificationMessage
}

export default notificationsUtils