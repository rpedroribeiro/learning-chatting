import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faBell, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import '../../styles/chatting.css'
import type { ReactFormState } from 'react-dom/client'

interface commandHelperProps {
  command: string;
  className: string;
  setToggleCommandHelper: React.Dispatch<React.SetStateAction<boolean>>;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
}

const CommandHelper = ({
  command,
  className,
  setCommand,
  setToggleCommandHelper,
  setChatInput
}: commandHelperProps) => {

  const commands = [["commandBot", faRobot], ["ping", faBell]]

  const commandBotGuideLines = [["params:", "type inside single quotations"], ["accessible features:", "assignment, submisison, announcement, filesystem"]]

  const handleItemClick = (item: [string, IconDefinition]) => {
    setCommand(item[0])
    setChatInput('')
  }

  return (
    <div className={className}>
      {command.length === 0 ? commands.map((item: any, key: any) => (
        <div 
          onClick={() => handleItemClick(item)}
          className='command-helper-item' key={key}
        >
            <div className='command-helper-item-icon'>
              <FontAwesomeIcon icon={item[1]} />
            </div>
            <span>{item[0]}</span>
        </div>
      )) : command === "commandBot" ? (
        <>
          {commandBotGuideLines.map((guideline: any, key: any) => (
            <div className='command-helper-guideline-item'>
              <span>{guideline[0]}</span>
              <span style={{opacity: '40%'}}>{guideline[1]}</span>
            </div>
          ))}
        </>
      ) : []}
    </div>
  )
}

export default CommandHelper