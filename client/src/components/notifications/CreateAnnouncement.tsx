import { useState } from 'react'
import '../../styles/modal.css'
import notificationsApi from '../../api/notificationsApi'
import useAuth from '../../hooks/useAuth'
import useClassroom from '../../hooks/useClassroom'

interface createAnnoucementProps {
  setToggleAnnoucementModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateAnnoucement = ({setToggleAnnoucementModal}: createAnnoucementProps) => {
  const [announcementTitle, setAnnoncementTitle] = useState<string>('')
  const [annoucementDescription, setAnnoucementDescription] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { userId } = useAuth()
  const { currClass } = useClassroom()

  const handleCreateAnnoucement = async () => {
    const [status, message] = await notificationsApi.createAnnouncement(
      userId,
      currClass.id,
      announcementTitle,
      annoucementDescription
    )
    status ? setToggleAnnoucementModal(false) : setErrorMessage(message)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="close-container">
          <span 
            className="close"
            onClick={() => 
              {setToggleAnnoucementModal(false)}}
          >
            &times;
          </span>
        </div>
        <h1 className='modal-title'>Create New Course</h1>
        <form onSubmit={handleCreateAnnoucement} className='modal-form'>
          <div className='modal-input-container'>
            <label>Annoucement Title</label>
            <input required value={announcementTitle} onChange={e => setAnnoncementTitle(e.target.value)}/>
          </div>
          <div className='modal-input-container'>
            <label>Annoucement Description</label>
            <input required value={annoucementDescription} onChange={e => setAnnoucementDescription(e.target.value)}/>
          </div>
          <button className='modal-form-submit-btn'>Submit</button>
          {errorMessage && <span style={{color: 'rgb(217, 61, 61)'}}>{errorMessage}</span>}
        </form>
      </div>
    </div>
  )
}

export default CreateAnnoucement