import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const Notification = () => {
  const notification =  useSelector(state => state.notifications)

  if (notification === null) {
    return null
  }
  return (
    <div>
      {(notification.content &&
        <Alert severity={notification.type}>
          {notification.content}
        </Alert>
      )}
    </div>
  )
}

export default Notification