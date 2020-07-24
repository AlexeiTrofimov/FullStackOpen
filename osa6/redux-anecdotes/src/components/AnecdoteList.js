import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { likeAnecdote } from './../reducers/anecdoteReducer'
import { voteNotification, clearNotification } from './../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter === '' ) {
      return state.anecdotes
    }
    return state.anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))

  })
  const dispatch = useDispatch()

  const vote = (id, content) => {
    dispatch(likeAnecdote(id))
    dispatch(voteNotification(content))
    setTimeout(() => {
      dispatch(clearNotification())},5000)
  }

  anecdotes.sort((a,b) => b.votes - a.votes)

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList