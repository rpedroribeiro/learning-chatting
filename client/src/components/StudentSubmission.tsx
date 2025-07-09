import { useEffect, useState } from "react"
import useClassroom from "../hooks/useClassroom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpFromBracket, faClock } from "@fortawesome/free-solid-svg-icons"
import '../styles/submission.css'
import SubmissionFileItem from "./SubmissionFileItem"

const StudentSubmission = () => {
  const [dueDate, setDueDate] = useState<any>()
  const [fileNames, setFileNames] = useState<string[]>([])
  const [clockColor, setClockColor] = useState<any>()
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const { currAssignment } = useClassroom()

  useEffect(() => {
    // Due Date formatting
    const date = new Date(currAssignment.dueDate)
    date < new Date() ? setClockColor("rgb(217, 61, 61)") : setClockColor("#198E26")
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    setDueDate(formattedDate)

    // Files formatting
    setFileNames([])
    currAssignment.files.forEach((path: any) => {
      const nameCutoff = path.lastIndexOf('/')
      const fileName = path.substring(nameCutoff + 1)
      setFileNames(prev => [...prev, fileName])
    })
  }, [])

  return (
    <div className="submission-page">
      <h1 className="submission-page-title">{currAssignment.name}</h1>
      <hr style={{marginTop: '10px'}}/>
      <div className="submission-information-container">
        <div className="submission-information-container-date-container">
          <h2 className="submission-information-container-date-due">Due</h2>
          <h2 className="submission-information-container-date">
            {dueDate} <FontAwesomeIcon color={clockColor} size="sm" icon={faClock} />
          </h2>
        </div>
        <div className="submission-information-container-files-list">
          <h3>Files Attached</h3>
          <hr style={{marginBottom: '20px'}}/>
          {fileNames.length > 0 ? fileNames.map((item: any, key: any) => (
            <SubmissionFileItem key={key} filePath={item}/>
          )) : <span>No Supplemental Files Uploaded</span>}
        </div>
        <div className="submission-information-container-description">
          <h3>Description</h3>
          <p>{currAssignment.description}</p>
        </div>
        <button className="submission-information-container-upload-button">
          <FontAwesomeIcon icon={faArrowUpFromBracket}/>
          Upload Files
        </button>
        <div className="submission-information-container-files-list">
          <h3>Uploaded Files</h3>
          <hr style={{marginBottom: '20px'}}/>
          {uploadedFiles.length > 0 ? fileNames.map((item: any, key: any) => (
            <SubmissionFileItem key={key} filePath={item}/>
          )) : <span>No Files Uploaded</span>}
        </div>
        <button className="submission-information-container-submit-button">Submit Assignment</button>
      </div>
    </div>
  )
}

export default StudentSubmission