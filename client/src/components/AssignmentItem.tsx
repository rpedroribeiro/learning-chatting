import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { AssignmentStatus } from '../utils/assignmentStatus'
import useAuth from '../hooks/useAuth'
import '../styles/assignments.css'
import { UserRole } from '../utils/UserRole'
import { useEffect, useState } from 'react'
import assignmentsApi from '../api/assignmentsApi'
import useClassroom from '../hooks/useClassroom'
import { useNavigate } from 'react-router-dom'


interface assignmentItemProps {
  assignment: any;
  status: AssignmentStatus
}

const AssignmentItem = ({assignment, status}: assignmentItemProps) => {
  const [icon, setIcon] = useState<any>()
  const [color, setColor] = useState<any>()
  const { userId, accountType } = useAuth()
  const { currClass, setCurrAssignment } = useClassroom()
  const navigate = useNavigate()

  /**
   * On render this useEffect decides what color/icon should be displayed
   * in the item.
   */
  useEffect(() => {
    if (accountType === UserRole.Student) {
      setIcon(faClock)
      if (status === AssignmentStatus.Overdue) {
        setColor("rgb(217, 61, 61)")
      } else if (status === AssignmentStatus.Assigned) {
        setColor('rgb(255, 142, 28)')
      } else {
        setColor('#198E26')
      }
    } else {
      if (status === AssignmentStatus.Overdue) {
        setIcon(faClockRotateLeft)
      } else {
        setIcon(faClock)
      }
    }
  }, [])
  
  /**
   * This function fetches all the necessary information for the assignment and navigates
   * to a page display said information. Pages are different based off if the user is a 
   * student or a professor.
   */
  const handleItemClick = async () => {
    const fetchedAssignment = await assignmentsApi.fetchStudentAssignmentAndSubmission(
      userId,
      currClass.id,
      assignment.id
    )
    setCurrAssignment(fetchedAssignment)
    accountType === UserRole.Student ? 
    navigate(`/${userId}/classrooms/${currClass.id}/assignments/${fetchedAssignment.id}`) : 
    navigate(`/${userId}/classrooms/${currClass.id}/assignments/submissions`)
  }

  return (
    <div className='assignments-list-student-item' onClick={handleItemClick}>
      <div className='assignments-list-student-item-icon-conatiner'>
          <FontAwesomeIcon size='lg' icon={icon} color={color}/>
      </div>
      <div className='assignments-list-student-item-name'>
        <h3>{assignment.name}</h3>
      </div>
    </div>
  ) 
}

export default AssignmentItem