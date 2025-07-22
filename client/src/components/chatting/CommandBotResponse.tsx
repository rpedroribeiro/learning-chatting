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
    if (commandBotInfo[1] !== null) {
      const newMessage = chattingUtils.formatCommandBotMessage(
        accountType!,
        commandBotInfo[1],
        commandBotInfo[2],
        commandBotInfo[3]
      )
      setCommandBotMessage(newMessage)
    } else { setCommandBotMessage(commandBotInfo[2]) }
  }, [])

  return (
    <div className="command-bot-chat-container">
      <h4 style={{color: 'var(--button)'}}>Command Bot</h4>
      <h4>{commandBotMessage}</h4>
      {commandBotInfo[2] === CommandCategory.ViewFileSystemItem ? (
        <>
          {commandBotInfo[1].children.length > 0 ? commandBotInfo[1].children.map((file: any, key: any) => (
            <FileSystemItem props={file} key={key}/>
          )) : <FileSystemItem props={commandBotInfo[1]} />}
        </>
      ) : commandBotInfo[2] === CommandCategory.ViewAssignment ? (
        <CommandBotAssignment assignmentInfo={commandBotInfo[1]} params={commandBotInfo[3]}/>
      ) : commandBotInfo[2] === CommandCategory.ViewStudentSubmission ? (
        <CommandBotSubmission assignmentInfo={commandBotInfo[1]} />
      ) : []}
    </div>
  )
}
export default CommandBotResponse