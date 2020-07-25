import anecdoteService from './../services/anecdotes'

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const likeAnecdote = (anecdote) => {
  return async dispatch => {
    await anecdoteService.update(anecdote)
    dispatch({
      type: 'VOTE_ANECDOTE',
      data: anecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

const anecdoteReducer = (state = [], action) => {
  switch(action.type) {

  case 'NEW_ANECDOTE':
    return [...state, action.data]

  case 'INIT_ANECDOTES':
    return action.data

  case 'VOTE_ANECDOTE':
    const id = action.data.id
    const anecdoteToChange = action.data
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }
    return state.map(anecdote =>
      anecdote.id !== id ? anecdote : changedAnecdote
    )
  default:
    return state
  }
}

export default anecdoteReducer