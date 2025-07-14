import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import useClassroom from "../hooks/useClassroom"
import '../styles/course.css'
import useAuth from "../hooks/useAuth"
import notificationsUtils from "../utils/notificationsUtils"
import classesApi from "../api/classesApi"
import NotificationBanner from "../components/notifications/NotificationBanner"
import '../styles/notifications.css'

const ClassPage = () => {
  const [notificationClassName, setNotificationClassName] = useState<string>('')
  const [notificationType, setNotificationType] = useState<any>(null)
  const [notificationMessage, setNotificationMessage] = useState<any>(null)
  const [toggleBanner, setToggleBanner] = useState<boolean>(false)
  const { setIsClassroom } = useClassroom()
  const { socket, userId } = useAuth()

  useEffect(() => {
    setIsClassroom(true)
  }, [])

  useEffect(() => {
    if (!socket) return
    const handleNotificationReceived = async (classId: any, notificationType: any, data: any) => {
      console.log(data)
      const formattedMessage = notificationsUtils.formatNotificationMessage(
        data,
        notificationType
      )
      console.log(formattedMessage)
      const [classInfo, status, message] = await classesApi.getClassDetails(
        userId,
        classId
      )
      if (status) {
        setNotificationClassName(classInfo.name)
        setNotificationType(notificationType)
        setNotificationMessage(formattedMessage)
        setToggleBanner(true)
        setTimeout(() => {
          setNotificationClassName('')
          setNotificationType(null)
          setNotificationMessage(null)
          setToggleBanner(false)
        })
      }
    }
    socket.on('notificationPosted', handleNotificationReceived)
    return () => {
      socket?.off('notificationPosted', handleNotificationReceived)
    }
  }, [socket])

  return (
    <div className="course-page">
      <NotificationBanner
        className={`notification-banner ${toggleBanner ? 'visible' : ''}`} 
        notificationClassName={notificationClassName}
        notificationType={notificationType}
        notificationMessage={notificationMessage}
      />
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default ClassPage