import useClassroom from '../../hooks/useClassroom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import '../../styles/chatting.css'
import { useEffect, useState } from 'react'
import CommandHelper from './CommandHelper'

const ChattingContainer = () => {
  const [chatInput, setChatInput] = useState<string>('')
  const [command, setCommand] = useState<string>('')
  const [file, setFile] = useState<null | File>(null)
  const [toggleCommandHelper, setToggleCommandHelper] = useState<boolean>(false)
  const { currClass } = useClassroom()

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0]
    if (file) { setFile(file) }
  }

  useEffect(() => {
    if (chatInput.startsWith('@') && command.length === 0) { setToggleCommandHelper(true) }
    else if (command.length === 0) { setToggleCommandHelper(false) }
  }, [chatInput])

  const handleKeyClick = (lastKey: string) => {
    if (lastKey === "Backspace" && chatInput.length === 0) { setCommand(''); setToggleCommandHelper(false)}
  }

  return (
    <div className="chatting-page">
      <div className='chatting-header'>
        <h1>{currClass.className} | Class Chat</h1>
      </div>
      <div className='chatbox-container'>
        <CommandHelper
          command={command} 
          setCommand={setCommand}
          setToggleCommandHelper={setToggleCommandHelper}
          setChatInput={setChatInput}
          className={`command-helper-container ${toggleCommandHelper ? 'visible' : ''}`}
        />
        <div className='input-container'>
          {command.length > 0 && <span style={{opacity: '40%', marginRight: '5px'}}>{command}:</span>}
          <input 
            value={chatInput} 
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={(event) => handleKeyClick(event.key)}
          />
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