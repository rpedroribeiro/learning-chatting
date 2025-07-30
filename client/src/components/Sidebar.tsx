import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faComment, faRightFromBracket, faFolderOpen, faBook, faUser, faArrowLeft, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
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
  const { userId, setUserId, setAccountType, accountType, setSocket, profileImg, setProfileImg } = useAuth()
  const { isClassroom, setCurrFileItem, setIsClassroom, setCurrClass, setCurrFileItemChildren} = useClassroom()
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
    "Chatting": [faComment, "chatting"]
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
      setCurrFileItemChildren([])
      setSocket(null)
      navigate('/login')
    }
  }

  const handleCourseList = async () => {
    setIsClassroom(false)
    setCurrClass(null)
    setCurrFileItem(null)
    setCurrFileItemChildren([])
    navigate(`/${userId}/classrooms`)
  }

  const handleFileChange = async (event: any) => {
    const file = event.target.files?.[0]
    const profileImg = await authApi.updateProfilePicture(
      userId,
      file
    )
    setProfileImg(profileImg!)
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
          <input 
            type='file' id='upload-file-btn' 
            style={{display: 'none'}} 
            onChange={handleFileChange}
          />
          <label htmlFor="upload-file-btn" className="sidebar-profile-img-container">
            <img src={profileImg.length > 0 ? profileImg : profilePic} />
          </label>
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
      <div style={{borderBottom: '1px solid #959595'}} className='sidebar-nav-container'>
        <div style={{color: 'var(--button)'}} className='sidebar-nav-content'>
          <FontAwesomeIcon style={{transform: 'scale(1.25)'}} icon={faUser} />
          <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>{accountType}</span>
        </div>
      </div>
      {isClassroom ? (
        <>
          {Object.entries(nav).map(([key, value]) => (
            <Link
              key={key}
              to={value[1]}
              style={{ textDecoration: 'none', color: 'var(--textColor)' }}
              onClick={event => {
                event.preventDefault()
                handleLinkClick(key)
                navigate(value[1])
              }}
            >
              <div className='sidebar-nav-container'>
                <div className='sidebar-nav-content'>
                  <FontAwesomeIcon style={{ transform: 'scale(1.25)' }} icon={value[0]} />
                  <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>{key}</span>
                </div>
              </div>
            </Link>
          ))}
          <div
            onClick={handleCourseList}
            style={{ borderTop: '1px solid #959595' }}
            className='sidebar-nav-container'
          >
            <div className='sidebar-nav-content'>
              <FontAwesomeIcon style={{ transform: 'scale(1.25)' }} icon={faArrowLeft} />
              <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>Courses</span>
            </div>
          </div>
        </>
      ) : null}
        <div onClick={handleLogOut} style={{borderBottom: '1px solid #959595'}} className='sidebar-nav-container'>
          <div className='sidebar-nav-content'>
            <FontAwesomeIcon style={{transform: 'scale(1.25)'}} icon={faRightFromBracket} />
            <span className={`sidebar-nav-content-text${isHovered ? ' hovered' : ''}`}>Log out</span>
          </div>
        </div>
    </div>
  )
}

export default Sidebar