import '../../styles/modal.css'

interface viewAnnoucementProps {
  setToggleViewAnnouncement: React.Dispatch<React.SetStateAction<boolean>>;
  announcementTitle: string;
  announcementDescription: string;
}

const ViewAnnouncementModal = ({setToggleViewAnnouncement, announcementTitle, announcementDescription}: viewAnnoucementProps) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="close-container">
          <span 
            className="close"
            onClick={() => 
              {setToggleViewAnnouncement(false)}}
          >
            &times;
          </span>
        </div>
        <div className='modal-form'  style={{gap: '20px', marginTop: '-30px'}}>
          <h1 style={{fontWeight: 'bold'}}>Announcement</h1>
          <div className='modal-input-container'>
            <label style={{fontWeight: 'bold', fontSize: '25px'}}>{announcementTitle}</label>
          </div>
          <div className='modal-input-container'>
            <label style={{fontSize: '20px'}}>{announcementDescription}</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewAnnouncementModal