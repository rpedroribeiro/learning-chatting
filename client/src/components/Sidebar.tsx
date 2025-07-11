import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faFolderOpen, faBook, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import useClassroom from '../hooks/useClassroom'
import profilePic from '../assets/images/people-face-avatar-icon-cartoon-character-png.webp'
import '../styles/sidebar.css'
import '../styles/root.css'
import { Link } from 'react-router-dom'

interface navOptions {
  [key: string]: [IconDefinition, string];
}

const Sidebar = () => {
  const [baseUrl, setBaseUrl] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)
  const { isClassroom } = useClassroom()

  useEffect(() => {
    const currentUrl = String(window.location.href)
    const cutoffIndex = currentUrl.lastIndexOf('/')
    setBaseUrl(currentUrl.substring(0, cutoffIndex ))
  }, [])

  const nav: navOptions = {
    "Notifications": [faBell, "notifications"],
    "File System": [faFolderOpen, "files"],
    "Assignments": [faBook, "assignments"],
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
      {isClassroom ? 
        Object.entries(nav).map(([key, value]) => (
          <Link style={{ textDecoration: 'none', color: 'var(--text)' }} to={`${baseUrl}/${value[1]}`}>
            <div key={key} className='sidebar-nav-container'>
              <div className='sidebar-nav-content'>
                <FontAwesomeIcon size='lg' icon={value[0]} />
                <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>{key}</span>
              </div>
            </div>
          </Link>
        )) : []}
    </div>
  )
}

export default Sidebar