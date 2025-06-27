import '../styles/classrooms.css'

const ClassroomsGrid = () => {
  return (
    <div className="classroom-grid-container">
      <h1 className='classroom-grid-title'>Courses</h1>
      <hr style={{marginTop: '10px'}}/>
      <div className='classroom-grid'>
        <div className='classroom-card'>
          <div className='classroom-card-title'>
            <h2>Class Name</h2>
            <h4>Section ID: 28524</h4>
          </div>
          <div className='classroom-card-info'>
            <h4>Professor: Scott Dunning</h4>
            <div className='classroom-card-times'>
              <h4>Days: MWF</h4>
              <h4>Hours: 14:20 - 15:15</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassroomsGrid