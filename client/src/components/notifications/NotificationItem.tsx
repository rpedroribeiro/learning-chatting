import { useEffect, useState } from "react"
import { NotificationType } from "../../utils/NotificationType"
import notificationsUtils from "../../utils/notificationsUtils"
import '../../styles/notifications.css'

type notificationItemProps = {
  notification: any,
  notificationType: NotificationType
}

const NotificationItem = ({notification, notificationType}: notificationItemProps) => {
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [notificationTime, setNotificationTime] = useState<string>('')

  useEffect(() => {
    const [formattedMesssage, formattedTime] = notificationsUtils.formatNotificationItem(
      notification,
      notificationType
    )
    setNotificationMessage(formattedMesssage)
    setNotificationTime(formattedTime)
  }, [])

  return (
    <div className="notification-widget-item">
      <span
        style={notification.read === false ? {fontWeight: 'bold'} : {}} 
        className="notification-widget-item-text"
      >
        {notificationMessage}
      </span>
      <span
        style={notification.read === false ? {fontWeight: 'bold'} : {}} 
        className="notification-widget-item-text"
      >
        {notificationTime}
      </span>
    </div>
  )
}

export default NotificationItem