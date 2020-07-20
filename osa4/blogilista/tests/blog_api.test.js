const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')



beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
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

test('posted blog is saved', async () => {
  const newBlog = {
    'title': 'New blog',
    'author': 'new blogger',
    'url': 'http://www.newblog.com',
    'likes': 3
  }

  await api
    .post('/api/blogs')
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

  await api
    .post('/api/blogs')
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

  await api
    .post('/api/blogs')
    .send(noInformation)
    .expect(400)

  const response =await helper.blogsInDB()

  expect(response).toHaveLength(helper.initialBlogs.length)

})

test('blog can be deleted ', async () => {

  const initialBlogs =await helper.blogsInDB()

  await api
    .delete(`/api/blogs/${initialBlogs[0].id}`)
    .expect(204)

  const response =await helper.blogsInDB()

  expect(response).toHaveLength(helper.initialBlogs.length-1)

})

test('blog can be changed ', async () => {

  const initialBlogs =await helper.blogsInDB()

  console.log(initialBlogs[0])
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

afterAll(() => {
  mongoose.connection.close()
})