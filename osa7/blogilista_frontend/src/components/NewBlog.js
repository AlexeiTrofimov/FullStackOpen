import React, { useState } from 'react'
import {
  TextField,
  Button,
} from '@material-ui/core'

const CreateNew = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange = (event) => setAuthor(event.target.value)
  const handleUrlChange= (event) => setUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      'title': title,
      'author': author,
      'url': url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        <TextField
          label="title"
          value={title}
          onChange={(handleTitleChange)}
        />
      </div>
      <div>
        <TextField
          label="author"
          value={author}
          onChange={(handleAuthorChange)}
        />
      </div>
      <div>
        <TextField
          label="url"
          value={url}
          onChange={(handleUrlChange)}
        />
      </div>
      <Button variant="contained" color="primary" type="submit">
        create
      </Button>
    </form>
  )
}
export default CreateNew