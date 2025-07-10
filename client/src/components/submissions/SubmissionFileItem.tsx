import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import '../styles/submission.css'
import '../styles/file-system.css'
import { useEffect, useState } from 'react'
import submissionApi from '../../api/submissionApi'
import useAuth from '../../hooks/useAuth'
import useClassroom from '../../hooks/useClassroom'
import { UserRole } from '../../utils/UserRole'

interface submissionFileItemProps {
  file: any;
  accountType: UserRole;
}

const SubmissionFileItem = ({file, accountType}: submissionFileItemProps) => {
  const [fileName, setFileName] = useState<string>('')
  const { userId } = useAuth()
  const { currClass, currAssignment } = useClassroom()

  useEffect(() => {
    const index = file.lastIndexOf('/')
    setFileName(file.substring(index + 1))
  }, [])

  /**
   * 
   */
  const handleItemClick = async () => {
    const url = await submissionApi.getSignedUrlForFile(
        userId,
        currClass.id,
        currAssignment.id,
        file
      )
    url && window.open(url, '_blank')
  }

  return (
    <div style={accountType === UserRole.Professor ? {padding: '1vw', gap: '0.5vw', height: '6vh'} : {}} className='file-system-item' onClick={handleItemClick}>
      <div className='file-system-item-icon-conatiner'>
          <FontAwesomeIcon size={accountType === UserRole.Professor ? 'sm' : 'lg'} icon={faFile}/>
      </div>
      <div className='file-system-item-name'>
        <span style={accountType === UserRole.Professor ? {fontSize: '13px'} : {}} className='submission-information-container-file-name'>{fileName}</span>
      </div>
    </div>
  ) 
}

export default SubmissionFileItem