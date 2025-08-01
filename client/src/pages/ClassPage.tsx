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
  const [notificationClassId, setNotificationClassId] = useState<string>('')
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
      const formattedMessage = notificationsUtils.formatNotificationMessage(
        data,
        notificationType
      )
      const [classInfo, status, _message] = await classesApi.getClassDetails(
        userId,
        classId
      )
      if (status) {
        setNotificationClassName(classInfo.className)
        setNotificationClassId(classId)
        setNotificationType(notificationType)
        setNotificationMessage(formattedMessage)
        setToggleBanner(true)
        setTimeout(() => {
          setNotificationClassName('')
          setNotificationClassId('')
          setNotificationType(null)
          setNotificationMessage(null)
          setToggleBanner(false)
        }, 5000)
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
        classId={notificationClassId}
      />
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default ClassPage