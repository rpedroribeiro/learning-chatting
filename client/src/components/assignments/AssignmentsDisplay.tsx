import { useEffect, useState } from 'react'
import '../../styles/assignments.css'
import assignmentsApi from '../../api/assignmentsApi'
import useAuth from '../../hooks/useAuth'
import useClassroom from '../../hooks/useClassroom'
import CreateAssignmentModal from './CreateAssignmentModal'
import { UserRole } from '../../utils/UserRole'
import StudentAssignments from './StudentAssignments'
import ProfessorAssignments from './ProfessorAssignments'

const AssignmentsDisplay = () => {
  const [assignments, setAssignments] = useState<any>([])
  const [toggleCreateAssignment, setToggleCreateAssignment] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { userId, accountType } = useAuth()
  const { currClass } = useClassroom()

  /**
   * This function fetches all the assignments  currently attached to this class 
   * on component render using the useEffect and sets it to the assignments state 
   * to be used in the tsx.
   */
  const fetchAllAssignments = async () => {
    const [fetchedAssignments, status, message] = await assignmentsApi.getAllAssignmentsByClassId(
      userId,
      currClass.id
    )
    status ? setAssignments(fetchedAssignments) : console.log(message)
  }

  useEffect(() => {
    fetchAllAssignments()
  }, [toggleCreateAssignment])

  return (
    <div className="assignments-list">
      {toggleCreateAssignment && (<CreateAssignmentModal 
        setToggleCreateAssignment={setToggleCreateAssignment}
        setAssignments={setAssignments}
      />)}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5vw'}}>
          <h1 className='assignments-list-title'>Assignments</h1>
        </div>
        {(accountType === UserRole.Professor) && (
          <button 
            className='assignments-create-button'
            onClick={() => setToggleCreateAssignment(true)}
          >
            Create New Assignment
          </button>
        )}
      </div>
      <hr style={{marginTop: '10px'}}/>
      <div className='assignments-list-container'>
        {((assignments && assignments.length > 0) ? (accountType === UserRole.Student ? 
          <StudentAssignments assignments={assignments}/> : 
          <ProfessorAssignments assignments={assignments} />
        ) : [])}
      </div>
    </div>
  )
}

export default AssignmentsDisplay