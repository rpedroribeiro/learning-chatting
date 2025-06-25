import { useEffect } from 'react'
import useClassroom from '../hooks/useClassroom'
import Sidebar from '../components/Sidebar'
import '../styles/classrooms.css'

const ClassroomsPage = () => {
  
  const { setIsClassroom } = useClassroom()

  useEffect(() => {
    setIsClassroom(false)
  }, [])

  return (
    <div className='classroom-page'>
      <Sidebar />
      <h1>hello</h1>
    </div>
  )
}

export default ClassroomsPage