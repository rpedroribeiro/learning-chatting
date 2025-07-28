import { useEffect, useState } from "react"
import { CommandCategory } from "../../utils/CommandCategory"
import FileSystemItem from "../files/FileSystemItem"
import chattingUtils from "../../utils/chattingUtils"
import CommandBotAssignment from "./CommandBotAssignment"
import CommandBotSubmission from "./CommandBotSubmission"
import useAuth from "../../hooks/useAuth"

interface commandBotProps {
  commandBotInfo: any;
  senderId: string;
  senderName: string;
}

const CommandBotResponse = ({commandBotInfo, senderId, senderName}: commandBotProps) => {
  const [formattedTime, setFormattedTime] = useState<string>('')
  const [commandBotMessage, setCommandBotMessage] = useState<string>('')
  const { accountType, userId } = useAuth()

  useEffect(() => {
    if (commandBotInfo[1] !== null) {
      const messageSentTime = new Date(commandBotInfo[1].createdAt)
      const formattedSentTime = messageSentTime.toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      setFormattedTime(formattedSentTime)
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
    <div className="command-bot-chat-container" style={
      senderId === userId ? {alignSelf: 'flex-end', textAlign: 'right'} : 
      {alignSelf: 'flex-start', textAlign: 'left'}}
    >
      <h4 style={{color: 'var(--button)'}}>Command Bot - Linked By {senderName}</h4>
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
        <CommandBotSubmission assignmentInfo={commandBotInfo[1]} record={commandBotInfo[4]}/>
      ) : []}
      <span style={{marginTop: '5px', fontSize: '12px'}}>{formattedTime}</span>
    </div>
  )
}
export default CommandBotResponse