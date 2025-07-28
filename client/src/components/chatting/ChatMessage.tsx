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
    <div className="chat-message" style={
      messageData.senderId === userId ? {alignSelf: 'flex-end', textAlign: 'right'} : 
      {alignSelf: 'flex-start', textAlign: 'left'}}
    >
      <h3 className="chat-message-sender">{messageData.sender.firstName} {messageData.sender.lastName}</h3>
      <h3 style={{fontSize: '17px'}}>{messageData.content}</h3>
      <span style={{marginTop: '5px', fontSize: '12px'}}>{formattedTime}</span>
    </div>
  )
}

export default ChatMessage