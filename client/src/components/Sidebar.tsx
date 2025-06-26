import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faFolderOpen, faBook, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import useClassroom from '../hooks/useClassroom'
import profilePic from '../assets/images/people-face-avatar-icon-cartoon-character-png.webp'
import '../styles/sidebar.css'
import '../styles/root.css'

interface navOptions {
  [key: string]: IconDefinition;
}

const Sidebar = () => {

  const [isHovered, setIsHovered] = useState(false)
  const { isClassroom } = useClassroom()

  const nav: navOptions = {
    "Notification": faBell,
    "File System": faFolderOpen,
    "Assignments": faBook,
  }

  return (
    <div 
      className="sidebar-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        maxWidth: isHovered ? '16vw' : '8vw'
      }}
    >
      <div className='sidebar-profile-container'>
        <div className='sidebar-profile-info'>
          <div className='sidebar-profile-img-container'>
            <img src={profilePic}/>
          </div>
          {isHovered && (
                      <div 
            className={`sidebar-profile-name${isHovered ? ' hovered' : ''}`}
          >
            <span>Pedro</span>
            <span>Ribeiro</span>
          </div>
          )}
        </div>
      </div>
      { !isClassroom ? 
        Object.entries(nav).map(([key, value]) => (
          <div key={key} className='sidebar-nav-container'>
            <div className='sidebar-nav-content'>
              <FontAwesomeIcon style={{transform: 'scale(1.25)'}} icon={value} />
              <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>{key}</span>
            </div>
          </div>
        )) : []}
    </div>
  )
}

export default Sidebar