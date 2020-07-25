import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content , votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (anecdote) => {
  const updatedObject = {
    content: anecdote.content,
    votes: anecdote.votes + 1
  }
  const response= axios.put(`${baseUrl}/${anecdote.id}`, updatedObject)
  return response.data
}

export default { getAll, createNew, update }