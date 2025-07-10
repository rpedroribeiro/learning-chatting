import type { NotificationType } from "../../utils/NotificationType"
import '../../styles/notifications.css'
import { useEffect } from "react"
import notificationsApi from "../../api/notificationsApi"
import useAuth from "../../hooks/useAuth"
import useClassroom from "../../hooks/useClassroom"

interface notificationWidgetProps {
  widgetName: string,
  notificationType: NotificationType
}

const NotificationWidget = ({widgetName, notificationType}: notificationWidgetProps) => {

  const { userId } = useAuth()
  const { currClass } = useClassroom()

  const fetchNotifications = async () => {
    const notifications = await notificationsApi.fetchNotificationsPerCategoryForUser(
      userId,
      currClass.id,
      notificationType
    )
  }

  useEffect(() => {
    fetchNotifications()
  })

  return (
    <div className="notification-widget">
      <h1 className="notification-widget-title">{widgetName}</h1>
      <div className="notification-widget-list">

      </div>
    </div>
  )
}

export default NotificationWidget