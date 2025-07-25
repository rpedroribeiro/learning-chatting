import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useEffect } from "react"

interface notificationBannerProps {
  notificationClassName: string,
  notificationType: any,
  notificationMessage: any,
  className?: string,
  classId: string
}

const NotificationBanner = ({
  notificationClassName, 
  notificationType, 
  notificationMessage, 
  className,
  classId
}: notificationBannerProps) => {
  const navigate = useNavigate()
  const { userId } = useAuth()

  useEffect(() => {
    console.log(notificationClassName)
  }, [])

  const handleNotificationClick = () => {
    navigate(`/${userId}/classrooms/${classId}/notifications`)
  }

  return (
    <div onClick={handleNotificationClick} className={className}>
      <h3 className="notification-banner-message">{notificationMessage}</h3>
      <h3 className="notification-banner-info">{notificationClassName}</h3>
      <h4 className="notification-banner-info">Widget: {notificationType}</h4>
    </div>
  )
}

export default NotificationBanner