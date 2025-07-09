import { useEffect, useState } from "react"
import useClassroom from "../hooks/useClassroom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpFromBracket, faClock } from "@fortawesome/free-solid-svg-icons"
import '../styles/submission.css'
import SubmissionFileItem from "./SubmissionFileItem"
import submissionApi from "../api/submissionApi"
import useAuth from "../hooks/useAuth"
import assignmentsApi from "../api/assignmentsApi"

const StudentSubmission = () => {
  const [dueDate, setDueDate] = useState<any>()
  const [clockColor, setClockColor] = useState<any>()
  const { userId } = useAuth()
  const { currAssignment, currClass, setCurrAssignment } = useClassroom()

  useEffect(() => {
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

  }, [])

  const handleUploadFile = async (event: any) => {
    const file = event.target.files?.[0]
    await submissionApi.uploadSubmissionFile(
      userId,
      currClass.id,
      currAssignment.id,
      file
    )

    const updatedAssignment = await assignmentsApi.fetchStudentAssignmentAndSubmission(
      userId,
      currClass.id,
      currAssignment.id
    )

    setCurrAssignment(updatedAssignment.submissions)
  }

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
          {currAssignment.files.length > 0 ? currAssignment.files.map((file: any, key: any) => (
            <SubmissionFileItem key={key} file={file}/>
          )) : <span>No Supplemental Files Uploaded</span>}
        </div>
        <div className="submission-information-container-description">
          <h3>Description</h3>
          <p>{currAssignment.description}</p>
        </div>
        <div>
          <input 
            type='file' id='upload-file-btn-submission' 
            style={{display: 'none'}} 
            onChange={handleUploadFile}
          />
        </div>
        <label htmlFor='upload-file-btn-submission' className="submission-information-container-upload-button">
          <FontAwesomeIcon icon={faArrowUpFromBracket}/>
          Upload Files
        </label>
        <div className="submission-information-container-files-list">
          <h3>Uploaded Files</h3>
          <hr style={{marginBottom: '20px'}}/>
          {currAssignment.submissions[0].uploadedFiles.length > 0 ? currAssignment.submissions[0].uploadedFiles.map((file: any, key: any) => (
            <SubmissionFileItem key={key} file={file}/>
          )) : <span>No Files Uploaded</span>}
        </div>
        <button className="submission-information-container-submit-button">Submit Assignment</button>
      </div>
    </div>
  )
}

export default StudentSubmission