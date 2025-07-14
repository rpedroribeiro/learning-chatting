import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useEffect } from "react"
import useClassroom from "../hooks/useClassroom"
import '../styles/course.css'
import useAuth from "../hooks/useAuth"

const ClassPage = () => {
  const { setIsClassroom } = useClassroom()
  const { socket } = useAuth()

  const handleNotificationReceived = (classId: any, notificationType: any, data: any) => {
    
  }

  useEffect(() => {
    setIsClassroom(true)
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('notificationPosted', handleNotificationReceived)
    return () => {
      socket?.off('notificationPosted', handleNotificationReceived)
    }
  }, [socket])

  return (
    <div className="course-page">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default ClassPage