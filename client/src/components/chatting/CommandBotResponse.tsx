import { useEffect, useState } from "react"
import { CommandCategory } from "../../utils/CommandCategory"
import FileSystemItem from "../files/FileSystemItem"
import chattingUtils from "../../utils/chattingUtils"
import CommandBotAssignment from "./CommandBotAssignment"
import CommandBotSubmission from "./CommandBotSubmission"
import useAuth from "../../hooks/useAuth"

interface commandBotProps {
  commandBotInfo: any
}

const CommandBotResponse = ({commandBotInfo}: commandBotProps) => {
  const [commandBotMessage, setCommandBotMessage] = useState<string>('')
  const { accountType } = useAuth()

  useEffect(() => {
    const newMessage = chattingUtils.formatCommandBotMessage(
      accountType!,
      commandBotInfo[2],
      commandBotInfo[1]
    )
    setCommandBotMessage(newMessage)
  }, [])

  return (
    <div className="command-bot-chat-container">
      <h4 style={{color: 'var(--button)'}}>Command Bot</h4>
      <h4>{commandBotMessage}</h4>
      {commandBotInfo[1] === CommandCategory.ViewFileSystemItem ? (
        <>
          {commandBotInfo[2].children.length > 0 ? commandBotInfo[2].children.map((file: any, key: any) => (
            <FileSystemItem props={file} key={key}/>
          )) : <FileSystemItem props={commandBotInfo[2]} />}
        </>
      ) : commandBotInfo[1] === CommandCategory.ViewAssignment ? (
        <CommandBotAssignment assignmentInfo={commandBotInfo[2]} params={commandBotInfo[3]}/>
      ) : commandBotInfo[1] === CommandCategory.ViewStudentSubmission ? (
        <CommandBotSubmission assignmentInfo={commandBotInfo[2]} />
      ) : []}
    </div>
  )
}
export default CommandBotResponse