import { useEffect } from 'react'
import useClassroom from '../hooks/useClassroom'
import Sidebar from '../components/Sidebar'
import ClassroomsGrid from '../components/ClassroomsGrid'
import '../styles/classrooms.css'

const ClassroomsPage = () => {
  
  const { setIsClassroom } = useClassroom()
  useEffect(() => { setIsClassroom(false) }, [])

  return (
    <div className='classroom-page'>
      <Sidebar />
      <ClassroomsGrid />
    </div>
  )
}

export default ClassroomsPage