import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faBell, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import '../../styles/chatting.css'
import type { ReactFormState } from 'react-dom/client'

interface commandHelperProps {
  className: string;
  setToggleCommandHelper: React.Dispatch<React.SetStateAction<boolean>>;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
}

const CommandHelper = ({
  className,
  setCommand,
  setToggleCommandHelper,
  setChatInput
}: commandHelperProps) => {

  const commands = [["commandBot", faRobot], ["ping", faBell]]

  const handleItemClick = (item: [string, IconDefinition]) => {
    setCommand(item[0])
    setToggleCommandHelper(false)
    setChatInput('')
  }

  return (
    <div className={className}>
      {commands.map((item: any, key: any) => (
        <div 
          onClick={() => handleItemClick(item)}
          className='command-helper-item' key={key}
        >
            <div className='command-helper-item-icon'>
              <FontAwesomeIcon icon={item[1]} />
            </div>
            <span>{item[0]}</span>
        </div>
      ))}
    </div>
  )
}

export default CommandHelper