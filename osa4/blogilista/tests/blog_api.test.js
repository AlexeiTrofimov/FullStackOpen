const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')


describe('when there is initially two blogs in db', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(helper.initialUsers[0].password, 10)
    let userObject = new User({
      'username': helper.initialUsers[0].username,
      'passwordHash': passwordHash
    })

    await userObject.save()

    const token = await helper.logInUser()
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    let blogObject = new Blog(helper.initialBlogs[0])
    blogObject.user = user.blogs.concat(user._id)
    await blogObject.save()


    blogObject = new Blog(helper.initialBlogs[1])
    blogObject.user = user.blogs.concat(user._id)
    await blogObject.save()

  })


  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('initial list has two blogs', async () => {
    const response =await helper.blogsInDB()

    expect(response).toHaveLength(2)
  })

  test('identifier is id', async () => {
    const response =await helper.blogsInDB()

    expect(response[0].id).toBeDefined()
  })

  test('login works', async () => {
    const logInInfo = {
      'username': helper.initialUsers[0].username,
      'password': helper.initialUsers[0].password,
    }
    await api
      .post('/api/login')
      .send(logInInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  })

  test('posted blog is saved', async () => {
    const token = await helper.logInUser()

    const newBlog = {
      'title': 'New blog',
      'author': 'new blogger',
      'url': 'http://www.newblog.com',
      'likes': 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response =await helper.blogsInDB()

    const titles = response.map(r => r.title)

    expect(response).toHaveLength(helper.initialBlogs.length + 1)

    expect(titles).toContain(
      'New blog'
    )
  })

  test('Likes set to 0 when none given', async () => {
    const noLikes = {
      'title': 'How to get likes',
      'author': 'Popular blogger',
      'url': 'http://www.newblog.com',
    }

    const token = await helper.logInUser()

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(noLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response =await helper.blogsInDB()

    const likes = response.map(r => r.likes)

    expect(likes[likes.length-1]).toBe(0)
  })

  test('400 returned when no title and url given ', async () => {
    const noInformation = {
      'author': 'no info',
      'likes': 3
    }
    const token = await helper.logInUser()

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(noInformation)
      .expect(400)

    const response =await helper.blogsInDB()

    expect(response).toHaveLength(helper.initialBlogs.length)

  })

  test('blog can be deleted ', async () => {

    const initialBlogs =await helper.blogsInDB()
    const token = await helper.logInUser()

    await api
      .delete(`/api/blogs/${initialBlogs[0].id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const response =await helper.blogsInDB()

    expect(response).toHaveLength(helper.initialBlogs.length-1)

  })

  test('blog can be changed ', async () => {

    const initialBlogs =await helper.blogsInDB()

    const changedBlog ={
      'title': 'Title 1',
      'author': 'Test',
      'url': 'https://www.12345.com',
      'likes': 5
    }

    await api
      .put(`/api/blogs/${initialBlogs[0].id}`)
      .send(changedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response =await helper.blogsInDB()

    expect(response[0].likes).toBe(5)

  })

  test('401 returned when no token given', async () => {

    const newBlog = {
      'title': 'New blog',
      'author': 'new blogger',
      'url': 'http://www.newblog.com',
      'likes': 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)
    const user = new User({ username: 'initial', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'testUser',
      name: 'Teemu Teekkari',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'initial',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is shorter than 3 symbols', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'yo',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3).')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is shorter than 3 symbols', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'newUser',
      name: 'Superuser',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password must be at least 3 symbols long')

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('400 returned when no username given', async () => {
    const usersAtStart = await helper.usersInDB()

    const noInformation = {
      name: 'Superuser',
      password: '129090',
    }

    await api
      .post('/api/users')
      .send(noInformation)
      .expect(400)

    const usersAtEnd = await helper.usersInDB()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

  test('400 returned when no password given ', async () => {
    const usersAtStart = await helper.usersInDB()

    const noInformation = {
      username: 'NewUser',
      name: 'Superuser',
    }

    const result = await api
      .post('/api/users')
      .send(noInformation)
      .expect(400)

    expect(result.body.error).toContain('Password is required')

    const usersAtEnd = await helper.usersInDB()

    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })

})

afterAll(() => {
  mongoose.connection.close()
})