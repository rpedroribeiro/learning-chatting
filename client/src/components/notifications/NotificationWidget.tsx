import { NotificationType } from "../../utils/NotificationType"
import '../../styles/notifications.css'
import { useEffect, useState } from "react"
import notificationsApi from "../../api/notificationsApi"
import useAuth from "../../hooks/useAuth"
import useClassroom from "../../hooks/useClassroom"
import NotificationItem from "./NotificationItem"

interface notificationWidgetProps {
  widgetName: string,
  notificationType: NotificationType
}

const NotificationWidget = ({widgetName, notificationType}: notificationWidgetProps) => {
  const [notificationForWidget, setNotificationsForWidget] = useState<any[]>([])
  const { userId } = useAuth()
  const { currClass } = useClassroom()

  const fetchNotifications = async () => {
    const notifications = await notificationsApi.fetchNotificationsPerCategoryForUser(
      userId,
      currClass.id,
      notificationType
    )
    setNotificationsForWidget(notifications)
  }

  useEffect(() => {
    fetchNotifications()
  })

  return (
    <div className="notification-widget">
      <h1 className="notification-widget-title">{widgetName}</h1>
      <div className="notification-widget-list">
        {notificationForWidget.length > 0 ? notificationForWidget.map((notificationItem: any, key: any) => (
          <NotificationItem key={key} notification={notificationItem} notificationType={notificationType} />
        )): <span>No notifications for this category</span>}
      </div>
    </div>
  )
}

export default NotificationWidget