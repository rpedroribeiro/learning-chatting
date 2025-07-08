import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { AssignmentStatus } from '../utils/assignmentStatus'
import useAuth from '../hooks/useAuth'
import '../styles/assignments.css'
import { UserRole } from '../utils/UserRole'
import { useEffect, useState } from 'react'


interface assignmentItemProps {
  assignment: any;
  status: AssignmentStatus
}

const AssignmentItem = ({assignment, status}: assignmentItemProps) => {
  const [icon, setIcon] = useState<any>()
  const [color, setColor] = useState<any>()
  const { accountType } = useAuth()

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
  
  const handleItemClick = () => {

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