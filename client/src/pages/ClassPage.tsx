import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useEffect } from "react"
import useClassroom from "../hooks/useClassroom"

const ClassPage = () => {

  const { setIsClassroom } = useClassroom()
  useEffect(() => { setIsClassroom(true) }, [])

  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  )
}

export default ClassPage