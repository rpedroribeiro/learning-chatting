import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faFolder, faClock} from '@fortawesome/free-solid-svg-icons'
import '../../styles/submission.css'
import { useEffect, useState } from 'react'
import SubmissionFileItem from './SubmissionFileItem'
import { UserRole } from '../../utils/UserRole'
import useAuth from '../../hooks/useAuth'

type submissionStudentItemProps = {
  submission: any;
  assignmentName?: any;
  dueDate: string
}

const SubmissionStudentItem = ({submission, dueDate, assignmentName}: submissionStudentItemProps) => {
  const [toggleUploadedFiles, setToggleUploadedFiles] = useState<boolean>(false)
  const [clockColor, setClockColor] = useState<string>('')
  const { accountType } = useAuth()

  useEffect(() => {
    const date = new Date(dueDate)
    if (submission.submitted) {
      new Date(submission.submissionTime) > date ? 
      setClockColor("rgb(217, 61, 61)") : setClockColor("#198E26")
    } else {
      new Date() > date ? setClockColor("rgb(217, 61, 61)") : setClockColor("rgb(255, 142, 28)")
    }
  }, [toggleUploadedFiles])
  
  return (
    <div className='submission-student-item'>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
        <div className='submission-student-item-container'>
          <div className='submission-student-icon-container'>
            <FontAwesomeIcon size='lg' icon={faGraduationCap}/>
          </div>
          <div className='submission-student-item-name'>
            <span className='submission-student-file-name'>
              {accountType === UserRole.Student && assignmentName 
                ? assignmentName
                : `${submission.student.firstName} ${submission.student.lastName}` 
              }
            </span>
          </div>
        </div>
        <div className='submission-student-item-container'>
          {toggleUploadedFiles && (
            <div className='submission-student-item-files-containers'>
              {submission.uploadedFiles.length > 0 ? submission.uploadedFiles.map((file: any, key: any) => (
                <SubmissionFileItem key={key} file={file} accountType={UserRole.Professor}/>
              )): <span>No files uploaded</span>}
            </div>
          )}
          <div id='submission-student-item-folder' className='submission-student-icon-container'>
            <FontAwesomeIcon 
              style={toggleUploadedFiles ? {color: 'var(--button)'} : {}}
              onClick={() => setToggleUploadedFiles(prev => !prev)} 
              size='lg' 
              icon={faFolder}
            />
          </div>
          <div id='submission-student-item-folder' className='submission-student-icon-container'>
            
            <FontAwesomeIcon color={clockColor} size='lg' icon={faClock}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionStudentItem