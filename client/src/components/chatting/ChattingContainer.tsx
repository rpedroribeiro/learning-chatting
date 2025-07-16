import useClassroom from '../../hooks/useClassroom'
import '../../styles/chatting.css'

const ChattingContainer = () => {
  const { currClass } = useClassroom()
  return (
    <div className="chatting-page">
      <div className='chatting-header'>
        <h1>{currClass.className} | Class Chat</h1>
      </div>
      <div className='chatbox-container'>
        
      </div>
    </div>
  )
}

export default ChattingContainer