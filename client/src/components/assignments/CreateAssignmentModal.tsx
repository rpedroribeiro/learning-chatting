import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import '../styles/modal.css'
import assignmentsApi from '../../api/assignmentsApi';
import useAuth from '../../hooks/useAuth';
import useClassroom from '../../hooks/useClassroom';

interface createAssignmentModalProps {
  setToggleCreateAssignment: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignments: React.Dispatch<React.SetStateAction<any>>;
}

const CreateAssignmentModal = ({setToggleCreateAssignment, setAssignments}: createAssignmentModalProps) => {
  const [assignmentName, setAssignmentName] = useState<string>('')
  const [assignmentDescription, setAssignmentDescription] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { userId } = useAuth()
  const { currClass } = useClassroom()

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0]
    if (file) {
      setFiles([...files, file])
    }
  }

  const handleAssignmentCreation = async (event: any) => {
    event.preventDefault()
    const assignments = await assignmentsApi.createAssignment(
      userId,
      currClass.id,
      assignmentName,
      assignmentDescription,
      dueDate,
      files
    )
    if (assignments) {
      setAssignments(assignments)
      setToggleCreateAssignment(false)
    } else {
      setErrorMessage("Could not create a new assignment")
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="close-container">
          <span 
            className="close"
            onClick={() => {setToggleCreateAssignment(false)}}
          >
            &times;
          </span>
        </div>
        <h1 className='modal-title'>Create New Assignment</h1>
        <form onSubmit={handleAssignmentCreation} className='modal-form'>
          <div className='modal-input-container'>
            <label>Assignment Name</label>
            <input required value={assignmentName} onChange={e => setAssignmentName(e.target.value)}/>
          </div>
          <div className='modal-input-container'>
            <label>Assignment Description</label>
            <input required value={assignmentDescription} onChange={e => setAssignmentDescription(e.target.value)}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className='modal-input-half-container'>
              <label>Select Due Date</label>
              <input required type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}/>
            </div>
            <div className='modal-input-half-container'>
              <label>Upload File</label>
              <input 
                type='file' id='upload-file-btn' 
                style={{display: 'none'}} 
                onChange={handleFileChange}
              />
              <label className='upload-file-btn' htmlFor='upload-file-btn'>
                <div>
                  <span>Choose File</span> <FontAwesomeIcon icon={faArrowDown}/>
                </div>
              </label>
              {files && files.length > 0 && (
                <div>
                  <p>Selected Files:</p>
                  {files.map((item) => (
                    <p style={{fontSize: '12px'}}>{item.name}</p>
                  ))}
                </div>
              )}
            </div>  
          </div>
          <button className='modal-form-submit-btn'>Submit</button>
          {errorMessage && <span style={{color: 'rgb(217, 61, 61)'}}>{errorMessage}</span>}
        </form>
      </div>
    </div>
  )
}

export default CreateAssignmentModal