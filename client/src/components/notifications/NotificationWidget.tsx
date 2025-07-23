import { NotificationType } from "../../utils/NotificationType"
import '../../styles/notifications.css'
import NotificationItem from "./NotificationItem"

interface notificationWidgetProps {
  notificationList: any,
  notificationType: NotificationType
}

const categoryToName = new Map<NotificationType, string>([
  [NotificationType.AnnouncementPosted, "Announcements"],
  [NotificationType.AssignmentPosted, "Assignments"],
  [NotificationType.FileSystemItemCreated, "File System Updates"],
  [NotificationType.StudentSubmission, "Submissions"]
])

const NotificationWidget = ({notificationList, notificationType}: notificationWidgetProps) => {
  return (
    <div className="notification-widget">
      <h1 className="notification-widget-title">{categoryToName.get(notificationType)}</h1>
      <div className="notification-widget-list">
        {(notificationList && notificationList.length > 0) ? notificationList.map((notificationItem: any, key: any) => (
          <NotificationItem key={key} notification={notificationItem} notificationType={notificationType} />
        )): <span>No notifications for this category</span>}
      </div>
    </div>
  )
}

export default NotificationWidget