import useClassroom from '../../hooks/useClassroom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import '../../styles/chatting.css'
import { useEffect, useState } from 'react'
import { commandBot } from '../../utils/commandBot'
import { targetSentenceToRoute } from '../../utils/targetSentenceToRoutes'
import CommandHelper from './CommandHelper'
import { CommandType } from '../../utils/CommandType'
import chattingApi from '../../api/chattingApi'
import useAuth from '../../hooks/useAuth'
import type { CommandCategory } from '../../utils/CommandCategory'
import CommandBotResponse from './CommandBotResponse'

type chatData = [CommandType | null, CommandCategory | null, any, string[]]

const ChattingContainer = () => {
  const [chatInput, setChatInput] = useState<string>('')
  const [bot, setBot] = useState<commandBot | null>(null)
  const [command, setCommand] = useState<any>(null)
  const [chats, setChats] = useState<chatData[]>([])
  const [file, setFile] = useState<null | File>(null)
  const [toggleCommandHelper, setToggleCommandHelper] = useState<boolean>(false)
  const { currClass } = useClassroom()
  const { userId } = useAuth()

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0]
    if (file) { setFile(file) }
  }

  useEffect(() => {
    const newBot = new commandBot([...targetSentenceToRoute.keys()])
    setBot(newBot)
  }, [])

  const handleSendButton = async () => {
    if (command === CommandType.CommandBot) {
      setCommand(null)
      setChatInput('')
      const result = bot?.findClosestMatch(chatInput)
      if (result) {
        let chatData: chatData
        const [method, route, params, record] = targetSentenceToRoute.get(result.sentenceFound!)!
        const filledRecord: Record<string, string> = {}
        const recordKeys = Object.keys(record)
        recordKeys.forEach((key, index) => {
          filledRecord[key] = result.tokenizedParams[index] ?? ""
        })
        switch (method) {
          case 'get':
            const [fetchData, fetchCategory] = await chattingApi.fetchCommandBotInformation(
              userId,
              currClass.id,
              route,
              filledRecord,
              params.includes('submission') ? true : false
            )
            chatData = [CommandType.CommandBot, fetchCategory, fetchData, params]
            setChats(prev => [...prev, chatData])
            break
          case 'put':
            const [putData, putCategory] = await chattingApi.putCommandBotInformation(
              userId,
              currClass.id,
              route,
              result.tokenizedParams,
            )
            chatData = [CommandType.CommandBot, putCategory, putData, params]
            setChats(prev => [...prev, chatData])
            break
        }
      }
    }
  }

  useEffect(() => {
    if (chatInput.startsWith('@') && command === null) { setToggleCommandHelper(true) }
    else if (command === null) { setToggleCommandHelper(false) }
  }, [chatInput])

  const handleKeyClick = (lastKey: string) => {
    if (lastKey === "Backspace" && chatInput.length === 0) { setCommand(null); setToggleCommandHelper(false)}
  }

  return (
    <div className="chatting-page">
      <div className='chatting-header'>
        <h1>{currClass.className} | Class Chat</h1>
      </div>
      <div className='chatbox-container'>
        <div className='chat-history'>
          {chats.length > 0 && chats.map((chat: any, key: any) => (
            <>
              {chat[0] === CommandType.CommandBot ? 
                <CommandBotResponse 
                  key={key}
                  commandBotInfo={chat}
                /> : 
                []
              }
            </>
          ))}
        </div>
        <div className='chatbox-interactive-container'>
          <CommandHelper
            command={command}
            setCommand={setCommand}
            setToggleCommandHelper={setToggleCommandHelper}
            setChatInput={setChatInput}
            className={`command-helper-container ${toggleCommandHelper ? 'visible' : ''}`}
          />
          <div className='input-and-send-container'>
            <div className='input-container'>
              {command !== null && <span style={{opacity: '40%', marginRight: '5px'}}>{command}:</span>}
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
            <div 
              className='send-btn-container' 
              style={chatInput.length > 0 ? {backgroundColor: 'var(--button)'} : {backgroundColor: 'var(--componentColor'}}
              onClick={handleSendButton}
            >
              <FontAwesomeIcon icon={faPaperPlane}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChattingContainer