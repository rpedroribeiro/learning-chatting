import { useEffect } from "react"
import SubmissionStudentItem from "../submissions/SubmissionStudentItem"
import useAuth from "../../hooks/useAuth";
import { UserRole } from "../../utils/UserRole";

interface commandBotSubmissionProps {
  assignmentInfo: any;
}

const CommandBotSubmission = ({assignmentInfo}: commandBotSubmissionProps) => {
  const { accountType } = useAuth()

  return (
    <div>
      {accountType === UserRole.Professor ? (
        assignmentInfo.submissions.map((submission: any, key: any) => (
          <SubmissionStudentItem key={key} submission={submission} dueDate={assignmentInfo.dueDate}/>
        ))) : <SubmissionStudentItem submission={assignmentInfo.submissions[0]} dueDate={assignmentInfo.dueDate} />
      }
    </div>
  )
}

export default CommandBotSubmission