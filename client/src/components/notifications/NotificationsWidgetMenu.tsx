import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import '../../styles/notifications.css'
import { UserRole } from '../../utils/UserRole'
import NotificationWidget from './NotificationWidget'
import notificationsApi from '../../api/notificationsApi'
import useClassroom from '../../hooks/useClassroom'
import CreateAnnouncementModal from './CreateAnnouncementModal'
import notificationsRanking from '../../utils/notificationsRanking'
import LoadingSpinner from '../LoadingSpinner'

const NotificationsWidgetMenu = () => {
  const [sortedWidgets, setSortedWidgets] = useState<any>()
  const [toggleAnnoucementModal, setToggleAnnoucementModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const { accountType, userId } = useAuth()
  const { currClass } = useClassroom()

  const sortNotificationWidgets = async () => {
    const userNotifications = await notificationsApi.fetchNotifications(
      userId,
      currClass.id,
      null
    )
    const widgetsInfo = notificationsRanking.fetchSortedWidgets(userNotifications)
    setSortedWidgets(widgetsInfo)
    setLoading(false)
  }

  useEffect(() => {
    sortNotificationWidgets()
  }, [])

  return (
    <>
      {!loading ?
        <div className='notifications-page'>
          {toggleAnnoucementModal && <CreateAnnouncementModal setToggleAnnoucementModal={setToggleAnnoucementModal}/>}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1.5vw'}}>
              <h1 className='notifications-title'>Notifications</h1>
            </div>
            {(accountType === UserRole.Professor) && 
              <button 
                className="create-announcement-btn"
                onClick={() => setToggleAnnoucementModal(true)}
              >
                Create Announcement
              </button>
            }
          </div>
          <hr style={{marginTop: '10px'}}/>
          <div className='notifications-widget-container'>
            {(sortedWidgets) &&
              (Array.from(sortedWidgets.entries()).map((notificationList: any, key: any) => (
                <NotificationWidget key={key} notificationList={notificationList[1]} notificationType={notificationList[0]}/>
              )))
            }
          </div>
        </div>
        : <LoadingSpinner />
      }
    </>
  )
}

export default NotificationsWidgetMenu