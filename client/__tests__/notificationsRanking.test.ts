import notificationsRanking from '../src/utils/notificationsRanking'
import { NotificationType } from '../src/utils/NotificationType'

describe('Notification urgency score functions', () => {
  const now = new Date()

  test('decayEquationAnnouncement returns decreasing score over time', () => {
    const recentNotification = { createdAt: now.toISOString() }
    const oldNotification = { createdAt: new Date(now.getTime() - 10 * 3600000).toISOString() }

    const recentScore = notificationsRanking.decayEquationAnnouncement(recentNotification)
    const oldScore = notificationsRanking.decayEquationAnnouncement(oldNotification)

    expect(recentScore).toBeGreaterThan(oldScore)
    expect(oldScore).toBeGreaterThanOrEqual(0.01)
  })

  test('decayEquationFileSystem returns decreasing score over time', () => {
    const recentNotification = { createdAt: now.toISOString() }
    const oldNotification = { createdAt: new Date(now.getTime() - 20 * 3600000).toISOString() }

    const recentScore = notificationsRanking.decayEquationFileSystem(recentNotification)
    const oldScore = notificationsRanking.decayEquationFileSystem(oldNotification)

    expect(recentScore).toBeGreaterThan(oldScore)
    expect(oldScore).toBeGreaterThanOrEqual(0.01)
  })

  test('assignmentUrgencyEquation returns higher score when due date is near', () => {
    const futureDue = new Date(now.getTime() + 2 * 3600000).toISOString()
    const pastDue = new Date(now.getTime() - 1 * 3600000).toISOString()

    const futureScore = notificationsRanking.assignmentUrgencyEquation({ dueDate: futureDue })
    const pastScore = notificationsRanking.assignmentUrgencyEquation({ dueDate: pastDue })

    expect(futureScore).toBeGreaterThan(pastScore)
    expect(pastScore).toBeCloseTo(1)
  })

  test('submissionUrgencyEquation adds late penalty if past due date', () => {
    const futureDue = new Date(now.getTime() + 3 * 3600000).toISOString()
    const pastDue = new Date(now.getTime() - 2 * 3600000).toISOString()

    const futureScore = notificationsRanking.submissionUrgencyEquation({ dueDate: futureDue })
    const pastScore = notificationsRanking.submissionUrgencyEquation({ dueDate: pastDue })

    expect(pastScore).toBeLessThanOrEqual(1)
    expect(futureScore).toBeGreaterThan(1)
  })
})

describe('fetchSortedWidgets', () => {
  const baseTime = new Date().getTime()

  const notifications = [
    {
      type: NotificationType.AnnouncementPosted,
      read: false,
      data: { createdAt: new Date(baseTime - 1 * 3600000).toISOString() },
    },
    {
      type: NotificationType.AnnouncementPosted,
      read: true,
      data: { createdAt: new Date(baseTime - 5 * 3600000).toISOString() },
    },
    {
      type: NotificationType.FileSystemItemCreated,
      read: false,
      data: { createdAt: new Date(baseTime - 2 * 3600000).toISOString() },
    },
    {
      type: NotificationType.AssignmentPosted,
      read: true,
      data: { dueDate: new Date(baseTime + 4 * 3600000).toISOString() },
    },
    {
      type: NotificationType.StudentSubmission,
      read: false,
      data: { dueDate: new Date(baseTime - 1 * 3600000).toISOString() },
    },
  ]

  test('returns a map with categories sorted by urgency and unread status', () => {
    const result = notificationsRanking.fetchSortedWidgets(notifications)

    expect(result.has(NotificationType.AnnouncementPosted)).toBe(true)
    expect(result.has(NotificationType.FileSystemItemCreated)).toBe(true)
    expect(result.has(NotificationType.AssignmentPosted)).toBe(true)
    expect(result.has(NotificationType.StudentSubmission)).toBe(true)

    const announcementNotifications = result.get(NotificationType.AnnouncementPosted)!
    expect(announcementNotifications.length).toBe(2)
    expect(announcementNotifications[0].read).toBe(false)

    const fileSystemNotifications = result.get(NotificationType.FileSystemItemCreated)!
    expect(fileSystemNotifications.length).toBe(1)
    expect(fileSystemNotifications[0].read).toBe(false)

    const assignmentNotifications = result.get(NotificationType.AssignmentPosted)!
    expect(assignmentNotifications.length).toBe(1)
    expect(assignmentNotifications[0].read).toBe(true)

    const submissionNotifications = result.get(NotificationType.StudentSubmission)!
    expect(submissionNotifications.length).toBe(1)
    expect(submissionNotifications[0].read).toBe(false)
  })
})