import useClassroom from '../../hooks/useClassroom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import '../../styles/chatting.css'
import { useState } from 'react'

const ChattingContainer = () => {
  const [chatInput, setChatInput] = useState<string>('')
  const [file, setFile] = useState<null | File>(null)
  const { currClass } = useClassroom()

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0]
    if (file) { setFile(file) }
  }

  return (
    <div className="chatting-page">
      <div className='chatting-header'>
        <h1>{currClass.className} | Class Chat</h1>
      </div>
      <div className='chatbox-container'>
        <div className='input-container'>
          <input value={chatInput} onChange={(event) => setChatInput(event.target.value)}/>
          <div style={{display: 'flex'}}>
            <label htmlFor="chat-file-upload" style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faImage} />
            </label>
            <input onChange={(event) => handleFileChange(event)} id='chat-file-upload' type='file' style={{ display: 'none' }}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChattingContainer