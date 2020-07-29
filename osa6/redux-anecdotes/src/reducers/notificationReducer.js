const initialState = null
var timeoutID

export const setNotification= (content, time) => {
  
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: content
    })
    clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, time*1000)
    console.log("second: ",timeoutID)
  }
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {

  case 'SET_NOTIFICATION':
    return action.data

  case 'CLEAR_NOTIFICATION':
    return null

  default:
    return state
  }
}

export default notificationReducer