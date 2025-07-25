import { useEffect } from "react"
import useAuth from "../../hooks/useAuth"

interface chatMessageProps {
  messageData: any
}

const ChatMessage = ({messageData}: chatMessageProps) => {
  const { userId } = useAuth()

  useEffect(() => {
    console.log(userId === messageData.senderId)
  }, [])

  return (
    <div className="chat-message" style={
      messageData.senderId === userId ? {alignSelf: 'flex-end', textAlign: 'right'} : 
      {alignSelf: 'flex-start', textAlign: 'left'}}
    >
      <h3 className="chat-message-sender">{messageData.sender.firstName} {messageData.sender.lastName}</h3>
      <h3 style={{fontSize: '17px'}}>{messageData.content}</h3>
    </div>
  )
}

export default ChatMessage