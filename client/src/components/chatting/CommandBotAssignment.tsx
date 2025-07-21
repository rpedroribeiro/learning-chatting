import { useEffect, useState } from "react"
import { UserRole } from "../../utils/UserRole"
import SubmissionFileItem from "../submissions/SubmissionFileItem"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import '../../styles/chatting.css'
import useClassroom from "../../hooks/useClassroom"

interface commandBotAssignmentProps {
  assignmentInfo: any;
  commandBotMessage: string;
}

const CommandBotAssignment = ({assignmentInfo}: commandBotAssignmentProps) => {
  const [dueDate, setDueDate] = useState<string>('')
  const [clockColor, setClockColor] = useState<string>('')
  const { setCurrAssignment } = useClassroom()

  useEffect(() => {
    setCurrAssignment(assignmentInfo.id)
    const date = new Date(assignmentInfo.dueDate)
    new Date() > date ? setClockColor("rgb(217, 61, 61)") : setClockColor("rgb(255, 142, 28)")
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

  return (
    <div className="command-bot-assignment">
      <h3>{assignmentInfo.name}</h3>
      <div className="command-bot-assignment-date">
        <h4>{dueDate}</h4>
        <FontAwesomeIcon icon={faClock} color={clockColor} />
      </div>
      <div className="command-bot-assignment-description">
        <h4>Assignment Description</h4>
        <p>{assignmentInfo.description}</p>
      </div>
      <div className="command-bot-assignment-files">
        <h4 className="command-bot-assignment-files-title">Assignment Files</h4>
        {assignmentInfo.files && assignmentInfo.files.length > 0 && assignmentInfo.files.map((file: any, key: any) => (
          <SubmissionFileItem file={file} key={key} accountType={UserRole.Student}/>
        ))}
      </div>
    </div>
  )
}

export default CommandBotAssignment