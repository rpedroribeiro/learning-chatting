import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import fileSystemApi from '../api/fileSystemApi'
import useAuth from '../hooks/useAuth'
import useClassroom from '../hooks/useClassroom'
import '../styles/file-system.css'

interface fileSytemItemProps {
  props: any;
  setCurrItemChildren: React.Dispatch<React.SetStateAction<any>>;
}

const FileSystemItem = ({props, setCurrItemChildren}: fileSytemItemProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { currClass, currFileItem, setCurrFileItem } = useClassroom()
  const { userId } = useAuth()

  const handleItemNavigation = async () => {
    setCurrFileItem(props)
    const [allChildren, status, message] = await fileSystemApi.getAllChidrenFromItemId(
      userId,
      currClass.id,
      props.id,
    )
    status ? setCurrItemChildren(allChildren) : setErrorMessage(message)
  }

  return (
    <div className='file-system-item' onClick={handleItemNavigation}>
      <div className='file-system-item-icon-conatiner'>
          <FontAwesomeIcon size='lg' icon={props.type === "Folder" ? faFolder : faFile}/>
      </div>
      <div className='file-system-item-name'>
        <h3>{props.name}</h3>
      </div>
    </div>
  ) 
}

export default FileSystemItem