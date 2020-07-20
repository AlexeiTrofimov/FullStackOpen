const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'Title 1',
    'author': 'Test',
    'url': 'https://www.12345.com',
    'likes': 1
  },
  {
    'title': 'Title 2',
    'author': 'Test',
    'url': 'https://www.asdf.com',
    'likes': 2
  },
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

module.exports = {
  initialBlogs, blogsInDB
}