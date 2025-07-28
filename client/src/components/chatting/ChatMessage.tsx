import { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"

interface chatMessageProps {
  messageData: any
}

const ChatMessage = ({messageData}: chatMessageProps) => {
  const [formattedTime, setFormattedTime] = useState<string>('')
  const { userId } = useAuth()

  useEffect(() => {
    const messageSentTime = new Date(messageData.createdAt)
    const formattedSentTime = messageSentTime.toLocaleString('en-US', {
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    setFormattedTime(formattedSentTime)
  }, [])

  return (
    <div style={
      messageData.senderId === userId ? {alignSelf: 'flex-end', textAlign: 'right', display: 'flex', flexDirection: 'column'} : 
      {alignSelf: 'flex-start', textAlign: 'left', display: 'flex', flexDirection: 'column'}}
    >
        <div className="chat-message">
          <h3 className="chat-message-sender">{messageData.sender.firstName} {messageData.sender.lastName}</h3>
          <h3 style={{fontSize: '17px'}}>{messageData.content}</h3>
        </div>
        <span style={{marginTop: '8px', fontSize: '10px'}}>{formattedTime}</span>
    </div>
  )
}

export default ChatMessage