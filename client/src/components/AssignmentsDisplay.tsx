import { useEffect, useState } from 'react'
import '../styles/assignments.css'
import assignmentsApi from '../api/assignmentsApi'
import useAuth from '../hooks/useAuth'
import useClassroom from '../hooks/useClassroom'

const AssignmentsDisplay = () => {
  const [assignments, setAssignments] = useState<any>()
  const { userId } = useAuth()
  const { currClass } = useClassroom()

  const fetchAllAssignments = async () => {
    const [fetchedAssignments, status, message] = await assignmentsApi.getAllAssignmentsByClassId(
      userId,
      currClass.id
    )
    status ? setAssignments(fetchedAssignments) : console.log(message)
  }

  useEffect(() => {
    fetchAllAssignments()
  }, [])

  return (
    <div className="assignments-list">
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5vw'}}>
          <h1 className='assignments-list-title'>Assignments</h1>
        </div>
      </div>
      <hr style={{marginTop: '10px'}}/>
    </div>
  )
}

export default AssignmentsDisplay