const initialState = null

export const voteNotification= (content) => {

  return {
    type: 'VOTE_FOR_ANECDOTE',
    data: content
  }
}

export const clearNotification = () => {

  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {

  case 'NEW_ANECDOTE':
    return `You created anecdote "${action.data.content}" `

  case 'VOTE_FOR_ANECDOTE':
    return `you voted "${action.data}" `

  case 'CLEAR_NOTIFICATION':
    return null

  default:
    return state
  }
}

export default notificationReducer