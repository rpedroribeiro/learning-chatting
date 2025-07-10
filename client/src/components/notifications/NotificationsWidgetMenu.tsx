import useAuth from '../../hooks/useAuth'
import '../../styles/notifications.css'
import { NotificationType } from '../../utils/NotificationType'
import { UserRole } from '../../utils/UserRole'

const NotificationsWidgetMenu = () => {
  const { accountType } = useAuth()

  const studentWidgets = [
    ["File System Updates", NotificationType.FileSystemItemCreated],
    ["Assignments", NotificationType.AssignmentPosted],
    ["Annoucements", NotificationType.AnnouncementPosted]
  ]

  const professorWidgets = [
    ["Submissions", NotificationType.StudentSubmission]
  ]

  return (
    <div className='notifications-page'>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5vw'}}>
          <h1 className='notifications-title'>Notifications</h1>
        </div>
      </div>
      <hr style={{marginTop: '10px'}}/>
      <div className='notifications-widget-container'>
        {accountType === UserRole.Student ?
          (studentWidgets.map((item: any, key: any) => (
            <></>
          ))) : (professorWidgets.map((item: any, key: any) => (
            <></>
          )))
        }
      </div>
    </div>
  )
}

export default NotificationsWidgetMenu