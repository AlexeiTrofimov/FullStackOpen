const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    'title': body.title,
    'author': body.author,
    'url': body.url,
    'likes': body.likes === undefined ? 0 : body.likes,
  })

  const savedBlog = await blog.save()
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
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter