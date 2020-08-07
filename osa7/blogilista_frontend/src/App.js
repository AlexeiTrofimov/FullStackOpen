import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams
} from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/UserForm'

import blogService from './services/blogs'
import userService from './services/users'


import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogReducer'
import { logOut } from './reducers/userReducer'

const Menu = ({ name, dispatch }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div className="menu">
      <Link to={'/'} style={padding}>blogs </Link>
      <Link to={'/users'} style={padding}>users</Link>
      {name} is logged in
      <button onClick={() => dispatch(logOut())}>logout</button>
    </div>
  )
}


const UserInfo = ({ users }) => {
  const id  = useParams().id
  const user = users.find(a => a.id === id)
  if (!user){
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => <li key ={blog.id}>{blog.title}</li>)}
      </ul>
    </div>
  )
}

const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        {users.map(user =>
          <tbody key ={user.id}>
            <tr>
              <th>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </th>
              <th>
                {user.blogs.length}
              </th>
            </tr>
          </tbody>)}
      </table>
    </div>
  )
}

const BlogInfo = ({ blogs, user }) => {
  const id  = useParams().id
  const blog = blogs.find(a => a.id === id)
  if (!blog){
    return null
  }
  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <Blog key={blog.id} blog={blog}
        blogs={blogs}
        username={user.username}
      />
    </div>
  )
}

const Blogs = ({ blogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    padding: 3,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return(
    <div>
      {blogs.map(blog =>
        <p style={blogStyle} key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </p>
      )}
    </div>
  )
}

const App = () => {

  const [users, setUsers] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  if (user !== null ) {
    blogService.setToken(user.token)
  }

  useEffect(() => {
    userService.getAll()
      .then(users => setUsers(users)
      )
  }, [])

  blogs.sort((a,b) => b.likes - a.likes)

  const graphicalInterface = () => {
    if (user === null) {
      return (
        <div>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm />
        </div>
      )
    }

    return (
      <div>
        <Router>
          <h2>blogs</h2>
          <Notification />
          <Menu name={user.name} dispatch={dispatch} />
          <Switch>
            <Route path="/blogs/:id">
              <BlogInfo blogs={blogs} user={user}/>
            </Route>
            <Route path="/users/:id">
              <UserInfo users={users}/>
            </Route>
            <Route path="/users">
              <Users users={users} />
            </Route>
            <Route path="/">
              <BlogForm />
              <Blogs blogs={blogs} />
            </Route>
          </Switch>
        </Router>
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