import { useEffect, useState } from 'react'
import '../styles/assignments.css'
import AssignmentItem from './AssignmentItem'
import { AssignmentStatus } from '../utils/AssignmentStatus'

interface studentAssignmentsProps {
  assignments: any
}

const StudentAssignments = ({assignments}: studentAssignmentsProps) => {
  const [submittedAssignments, setSubmittedAssignments] = useState<any[]>([])
  const [dueAssignments, setDueAssignments] = useState<any[]>([])
  const [overdueAssignments, setOverdueAssignments] = useState<any[]>([])

  /**
   * Splits the list of assignments into one of three states depending
   * on the submisson status on render.
   */
  useEffect(() => {
    setDueAssignments([])
    setSubmittedAssignments([])
    setOverdueAssignments([])
    for (const assignment of assignments) {
      if (assignment.submissions[0].submitted === true) {
        setSubmittedAssignments(prev => [...prev, assignment])
      } else if (new Date(assignment.dueDate) < new Date()) {
        setOverdueAssignments(prev => [...prev, assignment])
      } else {
        setDueAssignments(prev => [...prev, assignment])
      }
    }
  }, [assignments])

  return (
    <div className='assignments-list-student'>
      <div className='assignments-list-section'>
        <h1 className='assignments-list-section-title'>Assigned</h1>
        <div>
          {dueAssignments.length > 0 ?dueAssignments.map((item: any, key: any) => (
            <AssignmentItem key={key} assignment={item} status={AssignmentStatus.Assigned}/>
          )) : <span>No assignments have been assigned</span>}
        </div>
      </div>
      <div className='assignments-list-section'>
        <h1 className='assignments-list-section-title'>Overdue</h1>
        <div>
          {overdueAssignments.length > 0 ? overdueAssignments.map((item: any, key: any) => (
            <AssignmentItem key={key} assignment={item} status={AssignmentStatus.Overdue}/>
          )) : <span>No overdue assignments</span>}
        </div>
      </div>
      <div className='assignments-list-section'>
        <h1 className='assignments-list-section-title'>Submited</h1>
        <div>
          {submittedAssignments.length > 0 ? submittedAssignments.map((item: any, key: any) => (
            <AssignmentItem key={key} assignment={item} status={
              item.submissions[0].submissionTime > item.dueDate ? AssignmentStatus.Overdue : AssignmentStatus.Submitted
            }
            />)) : <span>No assignments have been submitted</span>
          }
        </div>
      </div>
    </div>
  )
}

export default StudentAssignments