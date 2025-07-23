import { NotificationType } from "./NotificationType"

const U_MAX = 1
const ANNOUNCEMENT_DECAY = -0.01
const FILE_SYSTEM_DECAY = -0.1
const ASSIGNMENT_SUBMISSION_DECAY = -0.05
const HOUR_DIVISER = 3600000
const LATE_WEIGHT = 1

const fetchedOrderStudentWidgets = (notifications: any) => {
  const studentCategoryMap = new Map<NotificationType, any[]>([])
  for (const notification of notifications) {
    if (studentCategoryMap.has(notification.type)) {
      studentCategoryMap.get(notification.type)!.push(notification)
    } else {
      studentCategoryMap.set(notification.type, notification)
    }
  }

  for (const [category, notificationList] of studentCategoryMap) {
    const notificationScore = new Map<any, number>([])
    notificationList.forEach(notification => {
      const notiScore = calculateNotificationUrgencyScore(category, notification.data)
      notificationScore.set(notification, notiScore)
    })
  }
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
  const hoursSinceAnnouncement = Math.round(timeNow.getTime() - notificationCreation.getTime() / HOUR_DIVISER)
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
  const hoursSinceAnnouncement = Math.round(timeNow.getTime() - notificationCreation.getTime() / HOUR_DIVISER)
  const score = U_MAX * (Math.exp(FILE_SYSTEM_DECAY * hoursSinceAnnouncement))
  return score <= 0.1 ? 0.01 : score
}

/**
 * 
 * @param notification 
 * @returns 
 */
const assignmentUrgencyEquation = (notification: any): number => {
  const timeNow = new Date().getTime()
  const dueDate = new Date(notification.data.dueDate).getTime()
  const hoursUntilDue = (dueDate - timeNow) / HOUR_DIVISER
  if (hoursUntilDue < 0) { return U_MAX / (Math.exp(0)) } 
  const score = U_MAX / (Math.exp(ASSIGNMENT_SUBMISSION_DECAY * (hoursUntilDue)))
  return score
}

/**
 * This function uses the urgency equation to calculate the urgency score of the file system update,
 * adds a late penalty if it is past the dueDate.
 * @param notification 
 * @returns 
 */
const submissionUrgencyEquation = (notification: any): number => {
  const timeNow = new Date().getTime()
  const dueDate = new Date(notification.data.dueDate).getTime()
  const hoursUntilDue = (dueDate - timeNow) / HOUR_DIVISER
  if (hoursUntilDue > 0) { return U_MAX / (Math.exp(ASSIGNMENT_SUBMISSION_DECAY * hoursUntilDue)) } 
  const lateScore = (U_MAX / (Math.exp(ASSIGNMENT_SUBMISSION_DECAY * hoursUntilDue))) + (LATE_WEIGHT * (1 - hoursUntilDue))
  return lateScore
}