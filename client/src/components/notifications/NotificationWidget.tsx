import type { NotificationType } from "../../utils/NotificationType"

interface notificationWidgetProps {
  widgetName: string,
  notificationType: NotificationType
}

const NotificationWidget = ({widgetName, notificationType}: notificationWidgetProps) => {
  return (
    <div>
      
    </div>
  )
}

export default NotificationWidget