import { useEffect, useReducer, useRef, useState } from 'react'
import FileItemModal from './FileItemModal'
import '../styles/file-system.css'
import useClassroom from '../hooks/useClassroom'
import fileSystemApi from '../api/fileSystemApi'
import useAuth from '../hooks/useAuth'
import FileSystemItem from './FileSystemItem'

const FilesDisplay = () => {
  const [toggleAddItemForm, setToggleAddItemForm] = useState<boolean>(false)
  const [currItemChildren, setCurrItemChildren] = useState<any>()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { userId } = useAuth()
  const { currClass, currFileItem, setCurrFileItem } = useClassroom()
  const initialRender = useRef(true)

  /**
   * Updates the current file item to the root based off the class id on reload.
   */
  useEffect(() => {
    setCurrFileItem(currClass.rootFile)
  }, [currClass])

  /**
   * Fetches all the children from the root file of the class on render, sets
   * them to a state if successful. If the fetch from the fileSystemApi was 
   * not successful, the error message is also stored in a state.
   */
  useEffect(() => {
    const fetchAllChildren = async () => {
      const [allChildren, status, message] = await fileSystemApi.getAllChidrenFromItemId(
        userId,
        currClass.id,
        currFileItem.id,
      )
      status ? setCurrItemChildren(allChildren) : setErrorMessage(message)
    }
    if (initialRender.current) { initialRender.current = false } else { fetchAllChildren() }
  }, [currFileItem])

  return (
    <div className="file-system-grid">
      {toggleAddItemForm ? <FileItemModal setToggleAddItemForm={setToggleAddItemForm}/> : []}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1 className='file-system-grid-title'>File System</h1>
        <button onClick={() => setToggleAddItemForm(true)} className='file-system-grid-button'>Add New Item</button>
      </div>
      <hr style={{marginTop: '10px'}}/>
      <div className='file-system-grid-container'>
        {currItemChildren ? currItemChildren.map((item: any, key: any) => (
          <FileSystemItem key={key} props={item} />
        )) : []}
      </div>
    </div>
  )
}

export default FilesDisplay