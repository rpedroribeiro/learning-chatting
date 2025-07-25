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
import ChatMessage from './ChatMessage'

type chatData = [CommandType | null, CommandCategory | null, any, string[], Record<string, string> | null]

const ChattingContainer = () => {
  const [chatInput, setChatInput] = useState<string>('')
  const [bot, setBot] = useState<commandBot | null>(null)
  const [command, setCommand] = useState<any>(null)
  const [file, setFile] = useState<null | File>(null)
  const [chatList, setChatList] = useState<any[]>([])
  const [classChatId, setClassChatId] = useState<string>('')
  const [toggleCommandHelper, setToggleCommandHelper] = useState<boolean>(false)
  const { currClass } = useClassroom()
  const { userId, accountType, socket } = useAuth()

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0]
    if (file) { setFile(file) }
  }

  const fetchAllChats = async () => {
    const response = await chattingApi.fetchAllClassChats(
      userId,
      currClass.id
    )
    if (response) {
      setClassChatId(response.id)
      setChatList(response.chats)
    }
  }

  useEffect(() => {
    fetchAllChats()
    const newBot = new commandBot([...targetSentenceToRoute.keys()])
    setBot(newBot)
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleMessageReceived = async (message: any) => {
      setChatList(prev => [...prev, message])
    }

    socket.on('newMessage', handleMessageReceived)
    return () => {
      socket.off('newMessage', handleMessageReceived)
    }
  }, [socket])

  const handleSendButton = async () => {
    if (command === CommandType.CommandBot) {
      setCommand(null)
      setChatInput('')
      const result = bot?.findClosestMatch(chatInput)
      if (result) {
        let chatData: chatData
        const [method, route, params, record] = targetSentenceToRoute.get(result.sentenceFound!)!
        if (record["accountType"] && record["accountType"] !== accountType) {
          chatData = [CommandType.CommandBot, null, "This user role cannot make this type of request", params, null]
          setChatList(prev => [...prev, chatData])
          return
        }
        const filledRecord: Record<string, string> = {}
        const recordKeys = Object.keys(record)
        recordKeys.forEach((key, index) => {
          filledRecord[key] = result.tokenizedParams[index] ?? ""
        })
        const submission: boolean = params.includes('submission')
        switch (method) {
          case 'get':
            const fetchResponse = await chattingApi.fetchCommandBotInformation(
              userId,
              currClass.id,
              route,
              filledRecord,
              (submission === true) ? true : undefined
            )
            if ( typeof fetchResponse === 'string' ) { chatData = [CommandType.CommandBot, null, fetchResponse, params, null] }
            else {
              const [fetchCategory, fetchData] = fetchResponse
              chatData = [CommandType.CommandBot, fetchCategory, fetchData, params, filledRecord]
            }
            socket.emit('message', userId, classChatId, true, chatData)
            break
          case 'put':
            const putResponse = await chattingApi.putCommandBotInformation(
              userId,
              currClass.id,
              route,
              filledRecord,
            )
            if ( typeof putResponse === 'string' ) { chatData = [CommandType.CommandBot, null, putResponse, params, null] }
            else {
              const [putCategory, putData] = putResponse
              chatData = [CommandType.CommandBot, putCategory, putData, params, filledRecord]
            }
            socket.emit('message', userId, classChatId, true, chatData)
            break
        }
      }
    } else if (command === null) {
      setChatInput('')
      socket.emit('message', userId, classChatId, false, chatInput)
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
          {(chatList && chatList.length > 0) && chatList.map((chat: any, key: any) => (
            <>
              {
                chat.command ? <CommandBotResponse commandBotInfo={chat.commandResponse} senderId={chat.senderId}/> :
                <ChatMessage messageData={chat}/>
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