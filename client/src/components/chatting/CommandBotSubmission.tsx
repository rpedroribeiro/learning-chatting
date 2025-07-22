import { useEffect, useState } from "react"
import SubmissionStudentItem from "../submissions/SubmissionStudentItem"
import useAuth from "../../hooks/useAuth"
import { UserRole } from "../../utils/UserRole";

interface commandBotSubmissionProps {
  assignmentInfo: any;
  record: Record<string, string>;
}

const CommandBotSubmission = ({ assignmentInfo, record }: commandBotSubmissionProps) => {
  const { accountType } = useAuth()
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([])

  useEffect(() => {
    if (record["studentName"]) {
      const rawName = record["studentName"]
      const cleanedName = rawName.replace(/^'+|'+$/g, '').toLowerCase()
      const matchedSubmissions = assignmentInfo.submissions.filter((submission: any) => {
        const fullName = `${submission.student.firstName} ${submission.student.lastName}`.toLowerCase()
        return fullName.includes(cleanedName)
      })
      setFilteredSubmissions(matchedSubmissions)
    } else { setFilteredSubmissions(assignmentInfo.submissions) }
  }, [assignmentInfo.submissions, record])

  return (
    <div>
      {accountType === UserRole.Professor ? (
        record["studentName"] ? (
          filteredSubmissions.map((submission: any, key: any) => (
            <SubmissionStudentItem key={key} submission={submission} dueDate={assignmentInfo.dueDate} />
          ))
        ) : (
          assignmentInfo.submissions.map((submission: any, key: any) => (
            <SubmissionStudentItem key={key} submission={submission} dueDate={assignmentInfo.dueDate} />
          ))
        )
      ) : (
        assignmentInfo.submissions.length > 0 && (
          <SubmissionStudentItem
            key={0}
            assignmentName={assignmentInfo.name}
            submission={assignmentInfo.submissions[0]}
            dueDate={assignmentInfo.dueDate}
          />
        )
      )}
    </div>
  )
}

export default CommandBotSubmission