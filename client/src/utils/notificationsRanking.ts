import { NotificationType } from "./NotificationType"

const U_MAX = 1
const ANNOUNCEMENT_DECAY = -0.01
const FILE_SYSTEM_DECAY = -0.1
const ASSIGNMENT_SUBMISSION_DECAY = -0.05
const HOUR_DIVISER = 3600000
const LATE_WEIGHT = 1

const ANNOUNCEMENT_WEIGHT = 2.5
const FILE_SYSTEM_WEIGHT = 0.8
const ASSIGNMENT_WEIGHT = 1.2
const SUBMISSION_WEIGHT = 1.2

const categoryToWeight = new Map<NotificationType, number>([
  [NotificationType.AnnouncementPosted, ANNOUNCEMENT_WEIGHT],
  [NotificationType.FileSystemItemCreated, FILE_SYSTEM_WEIGHT],
  [NotificationType.AssignmentPosted, ASSIGNMENT_WEIGHT],
  [NotificationType.StudentSubmission, SUBMISSION_WEIGHT]
])

/**
 * This functions takes in all the notifications and sorts them by widget. The notifications inside the 
 * widgets are ranked by if they are unread and their urgency score, while the widgets themseleves are 
 * ranked by their urgency score and if at least one notification is unread.
 * 
 * @param notifications All the notifications for the course.
 * @returns A map with the notification category as the key, and the data as the value.
 */
const fetchSortedWidgets = (notifications: any) => {
  const studentCategoryMap = new Map<NotificationType, any[]>([])
  const groupedCategoryMap = new Map<NotificationType, any[]>([])
  for (const notification of notifications) {
    if (studentCategoryMap.has(notification.type)) {
      studentCategoryMap.get(notification.type)!.push(notification)
    } else {
      studentCategoryMap.set(notification.type, [notification])
    }
  }

  for (const [category, notificationList] of studentCategoryMap) {
    const notificationScore = new Map<any, [number, boolean]>([])
    let categoryUnreadCount = 0
    notificationList.forEach(notification => {
      categoryUnreadCount = (notification.read) ? categoryUnreadCount + 1 : categoryUnreadCount
      const notiScore = calculateNotificationUrgencyScore(category, notification.data)
      notificationScore.set(notification, [notiScore, notification.read])
    })
    const notiScoreArray = Array.from(notificationScore)
    notiScoreArray.sort(([catA, [scoreA, readA]], [catB,  [scoreB, readB]]) => {
      if (readA !== readB) { return readA ? -1 : 1 }
      return scoreB - scoreA
    })
    let categorySum = 0
    notiScoreArray.forEach(notification => {
      categorySum += notification[1][0]
    })
    const finalScore = categorySum * (categoryUnreadCount + 1) * categoryToWeight.get(category)!
    if (groupedCategoryMap.has(category)) {
      groupedCategoryMap.get(category)!.push(notiScoreArray, finalScore, categoryUnreadCount > 0)
    } else {
      groupedCategoryMap.set(category, [notiScoreArray, finalScore, categoryUnreadCount > 0])
    }
  }
  const widgetArray = Array.from(groupedCategoryMap)
  widgetArray.sort(([catA, [_, sumA, readA]], [catB, [__, sumB, readB]]) => {
    if (readA !== readB) { return readA ? -1 : 1 }
    return sumB - sumA
  })
  const finalMap = new Map<NotificationType, any[]>()
  for (const [category] of widgetArray) {
    for (const data of widgetArray[0][1][0]) {
      if (finalMap.has(category)) {
        finalMap.get(category)!.push(data[0])
      } else {
        finalMap.set(category, [data[0]])
      }
    }
  }
  return finalMap
}

/**
 * This function takes in the notification category and data and determines which of the different
 * equations to use depending on the category passed in.
 * 
 * @param category - The category of the notification.
 * @param data - The data of the notification used for calculations.
 * @returns The urgency score of the notification passed in.
 */
const calculateNotificationUrgencyScore = (category: NotificationType, data: any): number => {
  switch (category) {
    case NotificationType.AnnouncementPosted:
      return decayEquationAnnouncement(data)
    case NotificationType.FileSystemItemCreated:
      return decayEquationFileSystem(data)
    case NotificationType.AssignmentPosted:
      return assignmentUrgencyEquation(data)
    case NotificationType.StudentSubmission:
      return submissionUrgencyEquation(data)
    default:
      return 0
  }
}

/**
 * This function uses the decay equation to calculate the urgency score of the announcement.
 * 
 * @param notification - The notification with all the data.
 * @returns The urgency score of the notification.
 */
const decayEquationAnnouncement = (notification: any): number => {
  const timeNow = new Date()
  const notificationCreation = new Date(notification.createdAt)
  const hoursSinceAnnouncement = Math.round((timeNow.getTime() - notificationCreation.getTime()) / HOUR_DIVISER)
  const score = U_MAX * (Math.exp(ANNOUNCEMENT_DECAY * hoursSinceAnnouncement))
  return score <= 0.1 ? 0.01 : score
}

/**
 * This function uses the decay equation to calculate the urgency score of the file system update.
 * 
 * @param notification - The notification with all the data.
 * @returns The urgency score of the notification.
 */
const decayEquationFileSystem = (notification: any): number => {
  const timeNow = new Date()
  const notificationCreation = new Date(notification.createdAt)
  const hoursSinceAnnouncement = Math.round((timeNow.getTime() - notificationCreation.getTime()) / HOUR_DIVISER)
  const score = U_MAX * (Math.exp(FILE_SYSTEM_DECAY * hoursSinceAnnouncement))
  return score <= 0.1 ? 0.01 : score
}

/**
 * This function uses the urgency equation to calculate the urgency score of the file system update.
 * 
 * @param notification - The notification with all the data.
 * @returns The urgency score of the notification.
 */
const assignmentUrgencyEquation = (notification: any): number => {
  const timeNow = new Date().getTime()
  const dueDate = new Date(notification.dueDate).getTime()
  const hoursUntilDue = (dueDate - timeNow) / HOUR_DIVISER
  if (hoursUntilDue < 0) { return U_MAX / (Math.exp(0)) } 
  const score = U_MAX / (Math.exp(ASSIGNMENT_SUBMISSION_DECAY * (hoursUntilDue)))
  return score
}

/**
 * This function uses the urgency equation to calculate the urgency score of the file system update,
 * adds a late penalty if it is past the dueDate.
 * 
 * @param notification - The notification with all the data.
 * @returns The urgency score of the notification.
 */
const submissionUrgencyEquation = (notification: any): number => {
  const timeNow = new Date().getTime()
  const dueDate = new Date(notification.dueDate).getTime()
  const hoursUntilDue = (dueDate - timeNow) / HOUR_DIVISER
  if (hoursUntilDue > 0) { return U_MAX / (Math.exp(ASSIGNMENT_SUBMISSION_DECAY * hoursUntilDue)) } 
  const lateScore = (U_MAX / (Math.exp(ASSIGNMENT_SUBMISSION_DECAY * hoursUntilDue))) + (LATE_WEIGHT * (1 - hoursUntilDue))
  return lateScore
}

const notificationsRanking = {
  fetchSortedWidgets
}

export default notificationsRanking