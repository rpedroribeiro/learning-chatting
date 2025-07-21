import { useEffect } from "react"
import SubmissionStudentItem from "../submissions/SubmissionStudentItem";

interface commandBotSubmissionProps {
  assignmentInfo: any;
}

const CommandBotSubmission = ({assignmentInfo}: commandBotSubmissionProps) => {

  return (
    <div>
      <SubmissionStudentItem 
        submission={assignmentInfo.submissions[0]} 
        dueDate={assignmentInfo.dueDate}
      />
    </div>
  )
}

export default CommandBotSubmission