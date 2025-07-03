import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useEffect } from "react"
import useClassroom from "../hooks/useClassroom"
import '../styles/course.css'

const ClassPage = () => {

  const { setIsClassroom } = useClassroom()
  useEffect(() => { setIsClassroom(true) }, [])

  return (
    <div className="course-page">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default ClassPage