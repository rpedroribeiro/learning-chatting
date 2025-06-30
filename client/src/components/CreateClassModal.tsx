import { useState } from 'react'
import '../styles/class-modal.css'
import classesApi from '../api/classesApi'
import useAuth from '../hooks/useAuth'

interface createClassModalProps {
  setToggleCreateForm: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateClassModal = ({setToggleCreateForm}: createClassModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [days, setDays] = useState<string>('')
  const [sectionId, setSectionId] = useState<string>('')
  const [courseName, setCourseName] = useState<string>('')
  const { userId } = useAuth() 

  /**
   * 
   * @param event 
   */
  const handleCreateCourse = async () => {
    const [newClass, status, message] = await classesApi.createCourse(
      userId,
      sectionId,
      startTime,
      endTime,
      days
    )
    status ? setToggleCreateForm(false) : setErrorMessage(message)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="close-container">
          <span 
            className="close"
            onClick={() => 
              {setToggleCreateForm(false)}}
          >
            &times;
          </span>
        </div>
        <h1 className='modal-title'>Create New Course</h1>
        <form onSubmit={handleCreateCourse} className='modal-form'>
          <div className='modal-input-container'>
            <label>Course Name</label>
            <input required value={courseName} onChange={e => setCourseName(e.target.value)}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className='modal-input-half-container'>
              <label>Start Time</label>
              <input required type='time'value={startTime} onChange={e => setStartTime(e.target.value)}/>
            </div>
            <div className='modal-input-half-container'>
              <label>End Time</label>
              <input required type='time'value={endTime} onChange={e => setEndTime(e.target.value)}/>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className='modal-input-half-container'>
              <label>Days</label>
              <select 
                required
                name='days'
                value={days}
                onChange={(event) => {setDays(event.target.value)}}
            >
                <option disabled value="">Select Days...</option>
                <option value="MWF">MWF</option>
                <option value="TuTh">TuTh</option>
                <option value="MW">MW</option>
              </select>
            </div>
            <div className='modal-input-half-container'>
              <label>Section ID</label>
              <input required value={sectionId} onChange={e => setSectionId(e.target.value)}/>
            </div>
          </div>
          <button className='modal-form-submit-btn'>Submit</button>
          {errorMessage && <span style={{color: 'rgb(217, 61, 61)'}}>{errorMessage}</span>}
        </form>
      </div>
    </div>
  )
}

export default CreateClassModal