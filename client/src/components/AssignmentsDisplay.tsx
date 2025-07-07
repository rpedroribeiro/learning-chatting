import '../styles/assignments.css'

const AssignmentsDisplay = () => {
  return (
    <div className="assignments-list">
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5vw'}}>
          <h1 className='assignments-list-title'>File System</h1>
        </div>
      </div>
      <hr style={{marginTop: '10px'}}/>
    </div>
  )
}

export default AssignmentsDisplay