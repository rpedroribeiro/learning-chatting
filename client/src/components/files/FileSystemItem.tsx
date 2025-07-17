import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import fileSystemApi from '../../api/fileSystemApi'
import useAuth from '../../hooks/useAuth'
import useClassroom from '../../hooks/useClassroom'
import '../../styles/file-system.css'
import { FileType } from '../../utils/FileType'

interface fileSytemItemProps {
  props: any;
}

const FileSystemItem = ({props}: fileSytemItemProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { currClass, currFileItem, setCurrFileItem, setCurrFileItemChildren } = useClassroom()
  const { userId } = useAuth()

  const handleItemClick = async () => {
    if (props.type === FileType.Folder) {
      setCurrFileItem(props)
      const [allChildren, status, message] = await fileSystemApi.getAllChidrenFromItemId(
        userId,
        currClass.id,
        props.id,
      )
      status ? setCurrFileItemChildren(allChildren) : setErrorMessage(message)
    } else {
      const [url, status, message] = await fileSystemApi.getSignedUrlForFile(
        userId,
        currClass.id,
        props.id
      )
      status ? window.open(url, '_blank') : setErrorMessage(message)
    }
  }

  return (
    <div className='file-system-item' onClick={handleItemClick}>
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