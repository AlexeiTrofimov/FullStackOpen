const Blog = require('../models/blog')
const User = require('../models/user')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


const initialBlogs = [
  {
    'title': 'Title 1',
    'author': 'Test',
    'url': 'https://www.12345.com',
    'likes': 1,
    'user': []
  },
  {
    'title': 'Title 2',
    'author': 'Test',
    'url': 'https://www.asdf.com',
    'likes': 2,
    'user': []
  },
]

const initialUsers = [
  {
    'username': 'TestLogIn',
    'name': 'Try to login',
    'password': 'password'
  },
]


const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}
const logInUser = async () => {

  const logInInfo = {
    'username': initialUsers[0].username,
    'password': initialUsers[0].password,
  }

  const result = await api
    .post('/api/login')
    .send(logInInfo)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  return result.body.token

}

module.exports = {
  initialBlogs,initialUsers, blogsInDB, usersInDB, logInUser
}