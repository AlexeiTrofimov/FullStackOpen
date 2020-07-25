const initialState = null

export const setNotification= (content, time) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: content
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, time*1000)
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