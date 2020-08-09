import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams
} from 'react-router-dom'
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Button,
} from '@material-ui/core'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/UserForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import userService from './services/users'
import { initializeBlogs } from './reducers/blogReducer'
import { logOut } from './reducers/userReducer'
import './index.css'

const Menu = ({ name, dispatch }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to='/'>
            blogs
          </Button>
          <Button color="inherit" component={Link} to='/users'>
            users
          </Button>
          {name} is logged in
          <Button onClick={() => dispatch(logOut())} color="inherit">
            logout
          </Button>
        </Toolbar>
      </AppBar>
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
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
  return(
    <div>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableBody>
            {blogs.map(blog => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
        <div className={'loginWindow'}>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm />
        </div>
      )
    }

    return (
      <div className={'blogWindow'}>
        <Router>
          <h1>BLOGS</h1>
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
    <Container className={'container'}>
      <div>
        {graphicalInterface()}
      </div>
    </Container>
  )
}

export default App