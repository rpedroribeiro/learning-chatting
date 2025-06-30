import { useContext } from 'react'
import ClassroomContext from '../context/ClassroomContext'

export default function useClassroom() {
  const context = useContext(ClassroomContext)
  if (!context) throw new Error('useClassroom must be used within a AuthProvider')
  return context
}