import { useCallback, useEffect, useState } from 'react'
import useClassroom from '../hooks/useClassroom'
import Sidebar from '../components/Sidebar'
import ClassroomsGrid from '../components/classes/ClassroomsGrid'
import '../styles/classrooms.css'
import useAuth from '../hooks/useAuth'
import NotificationBanner from '../components/notifications/NotificationBanner'
import { NotificationType } from '../utils/NotificationType'
import classesApi from '../api/classesApi'
import notificationsUtils from '../utils/notificationsUtils'
import '../styles/notifications.css'

const ClassroomsPage = () => {
  const [notificationClassName, setNotificationClassName] = useState<string>('')
  const [notificationType, setNotificationType] = useState<any>(null)
  const [notificationMessage, setNotificationMessage] = useState<any>(null)
  const [toggleBanner, setToggleBanner] = useState<boolean>(false)
  const { setIsClassroom } = useClassroom()
  const { socket, userId } = useAuth()
  useEffect(() => { setIsClassroom(false) }, [])

  useEffect(() => {
    if (!socket) return
    const handleNotificationReceived = async (classId: any, notificationType: any, data: any) => {
      const formattedMessage = notificationsUtils.formatNotificationMessage(
        data,
        notificationType
      )
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
        }, 5000)
      }
    }
    socket.on('notificationPosted', handleNotificationReceived)
    return () => {
      socket?.off('notificationPosted', handleNotificationReceived)
    }
  }, [socket])

  return (
    <div className='classroom-page'>
      <NotificationBanner 
        className={`notification-banner ${toggleBanner ? 'visible' : ''}`}
        notificationClassName={notificationClassName}
        notificationType={notificationType}
        notificationMessage={notificationMessage}
      />
      <Sidebar />
      <ClassroomsGrid />
    </div>
  )
}

export default ClassroomsPage