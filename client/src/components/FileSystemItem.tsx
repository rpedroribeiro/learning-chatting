import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import '../styles/file-system.css'

type fileSytemItemProps = {
  props: any
}

const FileSystemItem = ({props}: fileSytemItemProps) => {
  return (
    <div className='file-system-item'>
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