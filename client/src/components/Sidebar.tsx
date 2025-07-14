import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faRightFromBracket, faFolderOpen, faBook, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import useClassroom from '../hooks/useClassroom'
import profilePic from '../assets/images/people-face-avatar-icon-cartoon-character-png.webp'
import '../styles/sidebar.css'
import '../styles/root.css'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'
import useAuth from '../hooks/useAuth'

interface navOptions {
  [key: string]: [IconDefinition, string];
}

const Sidebar = () => {
  const [baseUrl, setBaseUrl] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)
  const { setUserId, setAccountType } = useAuth()
  const { isClassroom, setCurrFileItem, setIsClassroom, setCurrClass } = useClassroom()
  const navigate = useNavigate()

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

  const handleLinkClick = (key: string) => {
    key === "File System" && setCurrFileItem(null)
  }

  /**
   * Makes the api call to logout the user, then clears all the states from both
   * AuthContext and ClassroomContext.
   */
  const handleLogOut = async () => {
    const logoutMessage = await authApi.logOutAccount()
    if (logoutMessage) {
      setUserId('')
      setIsClassroom(false)
      setCurrClass(null)
      setCurrFileItem(null)
      setAccountType(null)
      navigate('/login')
    }
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
          <Link 
            to={value[1]} 
            style={{textDecoration: 'none', color: 'var(--textColor)'}}
            onClick={event => {
              event.preventDefault()
              handleLinkClick(key)
              navigate(value[1])
            }}
          >
            <div key={key} className='sidebar-nav-container'>
              <div className='sidebar-nav-content'>
                <FontAwesomeIcon style={{transform: 'scale(1.25)'}} icon={value[0]} />
                <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>{key}</span>
              </div>
            </div>
          </Link>
        )) : []}
        <div onClick={handleLogOut} style={{borderTop: '1px solid var(--textColor)'}} className='sidebar-nav-container'>
          <div className='sidebar-nav-content'>
            <FontAwesomeIcon style={{transform: 'scale(1.25)'}} icon={faRightFromBracket} />
            <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>Log out</span>
          </div>
        </div>
    </div>
  )
}

export default Sidebar