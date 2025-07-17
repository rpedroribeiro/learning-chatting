import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faBell } from '@fortawesome/free-solid-svg-icons'
import '../../styles/chatting.css'

interface commandHelperProps {
  className: string
}

const CommandHelper = ({className}: commandHelperProps) => {

  const commands = [["commandBot", faRobot], ["ping", faBell]]

  const handleCommandClick = () => {
    
  }

  return (
    <div className={className}>
      {commands.map((item: any, key: any) => (
        <div onClick={handleCommandClick} className='command-helper-item' key={key}>
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