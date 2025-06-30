import { useState } from 'react'
import '../styles/class-modal.css'
import useAuth from '../hooks/useAuth'
import classesApi from '../api/classesApi'

interface addClassModalProps {
  setToggleAddForm: React.Dispatch<React.SetStateAction<boolean>>
}

const AddClassModal = ({setToggleAddForm}: addClassModalProps) => {
  const [courseCode, setCourseCode] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { userId } = useAuth() 

  const handleAddCourse = async (event: any) => {
    event.preventDefault()
    const [studentClass, status, message] = await classesApi.addStudentToCourse(
      userId,
      courseCode
    )
    status ? setToggleAddForm(false) : setErrorMessage(message)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="close-container">
          <span 
            className="close"
            onClick={() => 
              {setToggleAddForm(false)}}
          >
            &times;
          </span>
        </div>
        <h1 className='modal-title'>Add New Course</h1>
        <form onSubmit={handleAddCourse} className='modal-form'>
          <div className='modal-input-container'>
            <label>Input Course Code</label>
            <input required value={courseCode} onChange={e => setCourseCode(e.target.value)}/>
          </div>
          <button className='modal-form-submit-btn'>Submit</button>
          {errorMessage && <span style={{color: 'rgb(217, 61, 61)'}}>{errorMessage}</span>}
        </form>
      </div>
    </div>
  )
}

export default AddClassModal