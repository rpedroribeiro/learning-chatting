import { useEffect, useState } from "react"
import { NotificationType } from "../../utils/NotificationType"
import notificationsUtils from "../../utils/notificationsUtils"
import '../../styles/notifications.css'
import notificationsApi from "../../api/notificationsApi"
import useClassroom from "../../hooks/useClassroom"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { FileType } from "../../utils/FileType"
import fileSystemApi from "../../api/fileSystemApi"

type notificationItemProps = {
  notification: any,
  notificationType: NotificationType
}

const NotificationItem = ({notification, notificationType}: notificationItemProps) => {
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [notificationTime, setNotificationTime] = useState<string>('')
  const { userId } = useAuth()
  const { currClass, setCurrFileItem, setCurrFileItemChildren } = useClassroom()
  const navigate = useNavigate()

  useEffect(() => {
    const [formattedMesssage, formattedTime] = notificationsUtils.formatNotificationItem(
      notification,
      notificationType
    )
    setNotificationMessage(formattedMesssage)
    setNotificationTime(formattedTime)
  }, [])

  /**
   * 
   */
  const handleNotificationStates = async () => {
    if (notificationType === NotificationType.FileSystemItemCreated) {
      if (notification.data.type === FileType.Folder) {
        setCurrFileItem(notification.data)
        const [currChildren, status, message] = await fileSystemApi.getAllChidrenFromItemId(
          userId,
          currClass.id,
          notification.data.id
        )
        status ? setCurrFileItemChildren(currChildren) : console.error(message)
      } else {
        const [newFileSystemItem, status, message] = await fileSystemApi.getFileSystemItemFromItemId(
          userId,
          currClass.id,
          notification.data.parentId
        )
        if (status) {
          setCurrFileItem(newFileSystemItem)
          setCurrFileItemChildren(newFileSystemItem.children)
        } else {
          console.error(message)
        }
      }
    }
  }

  /**
   * 
   */
  const handleNotificationClick = async () => {
    const markedRead = !notification.read ? await notificationsApi.readNotification(
      userId,
      currClass.id,
      notification.id
    ) : true

    await handleNotificationStates()
    const url = markedRead ? notificationsUtils.navigateToNotification(
      notificationType,
      userId,
      currClass.id,
      notification.data.id || null
    ) : null
    url && navigate(url)
  }

  return (
    <div onClick={handleNotificationClick} className="notification-widget-item">
      <span
        style={notification.read === false ? {fontWeight: 'bold'} : {}} 
        className="notification-widget-item-text"
      >
        {notificationMessage}
      </span>
      <span
        style={notification.read === false ? {fontWeight: 'bold'} : {fontWeight: 'normal'}} 
        className="notification-widget-item-text"
      >
        {notificationTime}
      </span>
    </div>
  )
}

export default NotificationItem