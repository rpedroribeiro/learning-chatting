import { NotificationType } from "./NotificationType"

const fetchedOrderStudentWidgets = (notifications: any) => {
  const studentCategoryMap = new Map<NotificationType, [data: any, read: boolean]>([]);
  for (const notification of notifications) {
    if (studentCategoryMap.has(notification.type)) {
      studentCategoryMap.get(notification.type)!.push({ data: notification.data, read: notification.read })
    } else {
      studentCategoryMap.set(notification.type, { data: notification.data, read: notification.read })
    }
  }

  for (const [category, notificationList] of studentCategoryMap) {
    notificationList.forEach(notification => {
      calculateNotificationUrgencyScore(category, notification.data)
    })
  }
}

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

const decayEquationAnnouncement = (data: NotificationData): number => {

}

const decayEquationFileSystem = (data: NotificationData): number => {

}

const assignmentUrgencyEquation = (data: NotificationData): number => {

}

const submissionUrgencyEquation = (data: NotificationData): number => {

}