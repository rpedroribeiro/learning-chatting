import { useEffect, useState } from 'react'
import classesApi from '../api/classesApi'
import useAuth from '../hooks/useAuth'
import classesUtils from '../utils/classesUtils'
import CreateClassModal from './CreateClassModal'
import AddClassModal from './AddClassModal'
import '../styles/classrooms.css'

const ClassroomsGrid = () => {
  const [classes, setClasses] = useState<any[]>([])
  const [days, setDays] = useState<string[]>([])
  const [hours, setHours] = useState<string[]>([])
  const [loadedData, setLoadedData] = useState<boolean>(false)
  const [toggleCreateForm, setToggleCreateForm] = useState<boolean>(false)
  const [toggleAddForm, setToggleAddForm] = useState<boolean>(false)
  const { userId, accountType } = useAuth()

  /**
   * This useEffect sends a GET request for all the classes associated
   * with the user on component load, and renders them in the grid. 
   */
  useEffect(() => {
    const fetchClasses = async () => {
      const [fetchedClasses, status, message] = await classesApi.fetchClasses(userId) 
      status ? setClasses(fetchedClasses!) : console.error(message)
    }
    fetchClasses()
  }, [userId])

  /**
   * This useEffect upon populating the classes state, reformats the times
   * fetched from the db to be presentable for the user.
   */
  useEffect(() => {
    if (classes && classes.length > 0) {
      const [newDays, newHours] = classesUtils.formatClassTimes(classes)
      setDays(newDays)
      setHours(newHours)
      setLoadedData(true)
    }
  }, [classes])

  return (
    <div className="classroom-grid-container">
      {toggleCreateForm ? <CreateClassModal setToggleCreateForm={setToggleCreateForm} /> : []}
      {toggleAddForm ? <AddClassModal setToggleAddForm={setToggleAddForm}/> : []}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1 className='classroom-grid-title'>Courses</h1>
        {accountType === "Student" ? 
          <button onClick={() => setToggleAddForm(true)} className='class-form-button'>Add New Class</button> :
          <button onClick={() => setToggleCreateForm(true)} className='class-form-button'>Create New Class</button>
        }
      </div>
      <hr style={{marginTop: '10px'}}/>
      <div className='classroom-grid'>
        {loadedData &&
          classes.map((item, index) => (
            <div key={item.id} className='classroom-card'>
              <div className='classroom-card-title'>
                <h2>{item.className}</h2>
                <h4>Section ID: {item.sectionId}</h4>
                {accountType === "Professor" && <h4>Course Code: {item.classCode}</h4>}
              </div>
              <div className='classroom-card-info'>
                <h4>Professor: {item.professor.firstName} {item.professor.lastName}</h4>
                <div className='classroom-card-times'>
                  <h4>{days[index]}</h4>
                  <h4>|</h4>
                  <h4>Hours: {hours[index]}</h4>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ClassroomsGrid