import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateNew from './components/NewBlog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      <p>{message}</p>
    </div>
  )
}

const ErrorMessage = ({ errorMsg }) => {
  if (errorMsg === null) {
    return null
  }

  return (
    <div className="error">
      <p>{errorMsg}</p>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  blogs.sort((a,b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMsg('Invalid username or password')
      setTimeout(() => {
        setErrorMsg(null)},3000)
    }

  }
  const addBlog = async (blogObject) => {
    try{
      await blogService.create(blogObject)

      blogService.getAll().then(blogs => setBlogs( blogs ))

      setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setMessage(null)},3000)
    } catch (exception) {
      setErrorMsg('All fields must be filled')
      setTimeout(() => {
        setErrorMsg(null)},3000)
    }
  }

  const changeBlog = async (id, blogObject) => {
    await blogService.update(id, blogObject)

    blogService.getAll().then(blogs => setBlogs( blogs ))

    setMessage(`you liked blog ${blogObject.title} by ${blogObject.author}`)
    setTimeout(() => {
      setMessage(null)},3000)
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)

    setBlogs(blogs.filter(blog => blog.id !== id))
    setMessage('Blog deleted successfully')
    setTimeout(() => {
      setMessage(null)},3000)
  }

  const newBlogForm = () => (
    <Togglable buttonLabel='new note'>
      <CreateNew
        createBlog={addBlog}
      />
    </Togglable>
  )

  const graphicalInterface = () => {
    if (user === null) {
      return (
        <div>
          <h2>Log in to application</h2>
          <ErrorMessage errorMsg={errorMsg} />
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                value={username}
                id="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                id="password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button id="login-button" type="submit">login</button>
          </form>
        </div>
      )
    }

    return (
      <div>
        <h2>blogs</h2>
        <Notification message={message} />
        <ErrorMessage errorMsg={errorMsg} />

        <p>
          {user.name} is logged in
          <button onClick={() => window.localStorage.removeItem('loggedUser')}>logout</button>
        </p>
        {newBlogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog}
            changedBlog={changeBlog}
            deleteBlog={deleteBlog}
            username={user.username}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      {graphicalInterface()}
    </div>
  )
}

export default App