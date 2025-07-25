import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import FileItemModal from './FileItemModal'
import useClassroom from '../../hooks/useClassroom'
import fileSystemApi from '../../api/fileSystemApi'
import useAuth from '../../hooks/useAuth'
import FileSystemItem from './FileSystemItem'
import '../../styles/file-system.css'
import { UserRole } from '../../utils/UserRole'
import LoadingSpinner from '../LoadingSpinner'

const FilesDisplay = () => {
  const [toggleAddItemForm, setToggleAddItemForm] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const { userId, accountType } = useAuth()
  const { currClass, currFileItem, setCurrFileItem, currFileItemChildren, setCurrFileItemChildren } = useClassroom()

  /**
   * This function takes in the itemId and fetches both all the children
   * to render as components and the rest of the information from the item
   * to store in the useClassroom.
   * 
   * @param itemId - The item id to fetch all the children from and to 
   * fetch the rest of its information.
   */
  const fetchAllChildren = async (itemId: string) => {
    const [allChildren, status, message] = await fileSystemApi.getAllChidrenFromItemId(
      userId,
      currClass.id,
      itemId
    )
    if (status) {
      setCurrFileItemChildren(allChildren)
      const [newFileSystemItem, itemStatus, itemMessage] = await fileSystemApi.getFileSystemItemFromItemId(
        userId,
        currClass.id,
        itemId
      )
      if (itemStatus) {
        setCurrFileItem(newFileSystemItem)
      } else {
        setErrorMessage(itemMessage)
      }
    } else {
      setErrorMessage(message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (currFileItem === null && currClass) { fetchAllChildren(currClass.rootFile.id) } else { setLoading(false) }
  }, [currFileItem === null])

  return (
    ((!loading && currFileItem !== null && currFileItemChildren) ? (
      <div className="file-system-grid">
        {toggleAddItemForm ? <FileItemModal setToggleAddItemForm={setToggleAddItemForm} /> : []}
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5vw'}}>
            <h1 className='file-system-grid-title'>File System</h1>
          </div>
          {accountType === UserRole.Professor  && <button onClick={() => setToggleAddItemForm(true)} className='file-system-grid-button'>Add New Item</button>}
        </div>
        <hr style={{marginTop: '10px'}}/>
        <div style={{display: 'flex', alignItems: 'center', gap: '1vw', padding: '4vh 0 0 0'}}>
          {(currFileItem && currFileItem.classId === null) && (
            <>
              <FontAwesomeIcon onClick={() => fetchAllChildren(currFileItem.parentId)} size='lg' icon={faArrowLeftLong}/>
              <h3>|</h3>
            </>
          )}
          <h3>Current Directory: {currFileItem.name}</h3>
        </div>
        <div className='file-system-grid-container'>
          {(currFileItemChildren && currFileItemChildren.length > 0) ? currFileItemChildren.map((item: any, key: any) => (
            <FileSystemItem key={key} props={item} />
          )) : <h4>No files or folders in this directory</h4>}
        </div>
      </div>
    ) : <LoadingSpinner />)
  )
}

export default FilesDisplay