import { useEffect, useState } from 'react'
import FileItemModal from './FileItemModal'
import '../styles/file-system.css'
import useClassroom from '../hooks/useClassroom'

const FilesDisplay = () => {
  const [toggleAddItemForm, setToggleAddItemForm] = useState<boolean>(false)
  const { currClass, currFileItem, setCurrFileItem } = useClassroom()

  useEffect(() => {
    setCurrFileItem(currClass.rootFile)
  }, [currClass])

  return (
    <div className="file-system-grid">
      {toggleAddItemForm ? <FileItemModal setToggleAddItemForm={setToggleAddItemForm}/> : []}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h1 className='file-system-grid-title'>File System</h1>
        <button onClick={() => setToggleAddItemForm(true)} className='file-system-grid-button'>Add New Item</button>
      </div>
      <hr style={{marginTop: '10px'}}/>
    </div>
  )
}

export default FilesDisplay