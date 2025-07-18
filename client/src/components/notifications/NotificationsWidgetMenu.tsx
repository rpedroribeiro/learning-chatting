import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import '../../styles/notifications.css'
import notificationsUtils from '../../utils/notificationsUtils'
import { UserRole } from '../../utils/UserRole'
import NotificationWidget from './NotificationWidget'
import notificationsApi from '../../api/notificationsApi'
import useClassroom from '../../hooks/useClassroom'

const NotificationsWidgetMenu = () => {
  const [sortedWidgets, setSortedWidgets] = useState<any[]>([])
  const { accountType, userId } = useAuth()
  const { currClass } = useClassroom()

  const sortNotificationWidgets = async () => {
    const userNotifications = await notificationsApi.fetchNotifications(
      userId,
      currClass.id,
      null
    )
    if (accountType === UserRole.Student) {
      const widgetsInfo = notificationsUtils.fetchedOrderStudentWidgets(userNotifications)
      setSortedWidgets(widgetsInfo)
    }
  }

  useEffect(() => {
    sortNotificationWidgets()
  }, [])

  return (
    <div className='notifications-page'>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5vw'}}>
          <h1 className='notifications-title'>Notifications</h1>
        </div>
      </div>
      <hr style={{marginTop: '10px'}}/>
      <div className='notifications-widget-container'>
        {sortedWidgets.length > 0 &&
          (sortedWidgets.map((widget: any, key: any) => (
            <NotificationWidget key={key} widgetName={widget[0]} notificationType={widget[1]}/>
          )))
        }
      </div>
    </div>
  )
}

export default NotificationsWidgetMenu