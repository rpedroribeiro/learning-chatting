import { useEffect } from "react"

interface notificationBannerProps {
  notificationClassName: string,
  notificationType: any,
  notificationMessage: any,
  className?: string
}

const NotificationBanner = ({
  notificationClassName, 
  notificationType, 
  notificationMessage, 
  className
}: notificationBannerProps) => {

  return (
    <div className={className}>
      <h3 className="notification-banner-message">{notificationMessage}</h3>
      <h3 className="notification-banner-info">{notificationClassName}</h3>
      <h4 className="notification-banner-info">{notificationType}</h4>
    </div>
  )
}

export default NotificationBanner