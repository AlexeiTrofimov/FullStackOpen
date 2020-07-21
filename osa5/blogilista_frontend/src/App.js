import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
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
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
      setErrorMsg("Invalid username or password")
        setTimeout(()=> {
          setErrorMsg(null)},3000) 
    }
  
  }

  const createBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      "title": title,
      "author": author,
      "url": url
    }
    
    await blogService.create(newBlog) 
    
    setMessage(`a new blog ${title} by ${author} added`)
        setTimeout(()=> {
          setMessage(null)},3000)
    
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const createNew = () => (
    <form onSubmit={createBlog}>
        <h2>create new</h2>
        <div>
          title:
            <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
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
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
        </div>
      )
    }
  
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={message} />
        
        <p>
          {user.name} is logged in
          <button onClick={() => window.localStorage.removeItem('loggedUser')}>logout</button>
        </p>
        {createNew()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
          
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