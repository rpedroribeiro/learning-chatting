import { useEffect } from "react"
import useClassroom from "../hooks/useClassroom"
import '../styles/submission.css'

const SubmissionList = () => {
  const { currAssignment } = useClassroom()

  useEffect(() => {
    console.log(currAssignment.submissions)
  }, [])

  return (
    <div className="submission-page">
      <h1 className="submission-page-title">{currAssignment.name} - Submissions</h1>
      <hr style={{marginTop: '10px'}}/>
      <div className="submission-information-container">
        <div className="submission-information-container-files-list">
          {currAssignment.submissions.length > 0 && currAssignment.submissions.map((submission: any, key: any) => (
            <h1>{}</h1>
          ))}
        </div>
      </div>
    </div>
)
}

export default SubmissionList