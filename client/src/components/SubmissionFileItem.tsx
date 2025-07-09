import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import '../styles/submission.css'
import '../styles/file-system.css'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useClassroom from '../hooks/useClassroom'

interface submissionFileItemProps {
  file: any
}

const SubmissionFileItem = ({file}: submissionFileItemProps) => {
  const [fileName, setFileName] = useState<string>('')
  const { userId } = useAuth()
  const { currClass } = useClassroom()

  useEffect(() => {
    const index = file.lastIndexOf('/')
    setFileName(file.substring(index + 1))
  }, [])

  const handleItemClick = async () => {
    
  }

  return (
    <div className='file-system-item' onClick={handleItemClick}>
      <div className='file-system-item-icon-conatiner'>
          <FontAwesomeIcon size='lg' icon={faFile}/>
      </div>
      <div className='file-system-item-name'>
        <span className='submission-information-container-file-name'>{fileName}</span>
      </div>
    </div>
  ) 
}

export default SubmissionFileItem