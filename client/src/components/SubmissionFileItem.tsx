import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import '../styles/submission.css'
import '../styles/file-system.css'

interface submissionFileItemProps {
  key: any
  filePath: string
}

const SubmissionFileItem = ({key, filePath}: submissionFileItemProps) => {

  const handleItemClick = () => {

  }

  return (
    <div className='file-system-item' onClick={handleItemClick}>
      <div className='file-system-item-icon-conatiner'>
          <FontAwesomeIcon size='lg' icon={faFile}/>
      </div>
      <div className='file-system-item-name'>
        <span className='submission-information-container-file-name'>{filePath}</span>
      </div>
    </div>
  ) 
}

export default SubmissionFileItem