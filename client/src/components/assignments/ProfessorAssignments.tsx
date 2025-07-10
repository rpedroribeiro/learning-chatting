import { useEffect, useState } from 'react'
import '../../styles/assignments.css'
import { AssignmentStatus } from '../../utils/AssignmentStatus'
import AssignmentItem from './AssignmentItem'

interface professorAssignmentsProps {
  assignments: any
}

const ProfessorAssignments = ({assignments}: professorAssignmentsProps) => {
  const [openedAssignments, setOpenedAssignments] = useState<any[]>([])
  const [closedAssignments, setClosedAssignments] = useState<any[]>([])

  useEffect(() => {
    setOpenedAssignments([])
    setClosedAssignments([])
    const date = new Date()
    for (const assignment of assignments) {
      if (new Date(assignment.dueDate) < date) {
        setClosedAssignments(prev => [...prev, assignment])
      } else {
        setOpenedAssignments(prev => [...prev, assignment])
      }
    }
  }, [])

  return (
    <div className='assignments-list-student'>
      <div className='assignments-list-section'>
        <h1 className='assignments-list-section-title'>Opened</h1>
        <div>
          {openedAssignments.length > 0 ? openedAssignments.map((item: any, key: any) => (
            <AssignmentItem key={key} assignment={item} status={AssignmentStatus.Assigned}/>
          )) : <span>No assignments are opened</span>}
        </div>
      </div>
      <div className='assignments-list-section'>
        <h1 className='assignments-list-section-title'>Closed</h1>
        <div>
          {closedAssignments.length > 0 ? closedAssignments.map((item: any, key: any) => (
            <AssignmentItem key={key} assignment={item} status={AssignmentStatus.Overdue}/>
          )) : <span>No closed assignments</span>}
        </div>
      </div>
    </div>
  )
}

export default ProfessorAssignments