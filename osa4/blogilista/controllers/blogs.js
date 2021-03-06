const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    'title': body.title,
    'author': body.author,
    'url': body.url,
    'likes': body.likes === undefined ? 0 : body.likes,
    'user': user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    'title': body.title,
    'author': body.author,
    'url': body.url,
    'likes': body.likes,
  }

  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  const savedBlog = await Blog.findById(request.params.id)
  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === decodedToken.id){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  else {
    return response.status(401).json({ error: 'Only blogs created by signed in user can be deleted' })
  }
})

module.exports = blogsRouter