import React, { useState } from 'react'

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
        title:
        <input
          id='title'
          type="text"
          value={title}
          onChange={(handleTitleChange)}
        />
      </div>
      <div>
        author:
        <input
          id='author'
          type="text"
          value={author}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          id='url'
          type="text"
          value={url}
          onChange={handleUrlChange}
        />
      </div>
      <button id="create-button" type="submit">create</button>
    </form>
  )
}
export default CreateNew