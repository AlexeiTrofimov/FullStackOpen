import loginService from './../services/login'

import { setNotification } from './notificationReducer'

const initialState = JSON.parse(window.localStorage.getItem('loggedUser'))

export const logIn = (username, password) => {
  let user = []
  return async dispatch => {
    try{
      user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      dispatch({
        type: 'LOGGED_USER',
        data: user
      })
      dispatch(setNotification('Login successful!', 'success', 5))
    }
    catch{
      dispatch(setNotification('Invalid password or username', 'error', 5))
    }
  }
}

export const logOut = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedUser')
    dispatch({
      type: 'LOGGED_OUT',
    })
  }
}




const userReducer = (state = initialState, action) => {
  switch(action.type) {
  case 'LOGGED_USER':
    return action.data
  case 'LOGGED_OUT': 
      return null
  default:
    return state
  }
}

export default userReducer