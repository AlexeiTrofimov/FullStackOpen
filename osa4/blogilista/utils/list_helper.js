const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return (
    blogs.map(blog => blog.likes).reduce(reducer,0)
  )
}

const favoriteBlog = (blogs) => {
  const maxValue = (sum, item) => Math.max(sum, item)

  const mostVotes = blogs.map(blog => blog.likes).reduce(maxValue,0)
  var returnedValue = []
  blogs.forEach(blog => {
    if (blog.likes === mostVotes){
      returnedValue = blog
    }
  })

  return returnedValue
}
const mostBlogs = (blogs) => {

  if (blogs.length > 1){
    const sorted = _.groupBy(blogs, 'author')
    var max = -Infinity
    var index = -1
    _.forEach(sorted, (a, i) => {
      if (a.length>max){
        max= a.length
        index = i
      }
    })

    return (
      {
        author: sorted[index][0].author,
        blogs: max
      }
    )
  }
  else if (blogs.length === 1){
    return (
      {
        author: blogs[0].author,
        blogs: 1
      }
    )
  }
  else return {}
}

const mostLikes = (blogs) => {
  if (blogs.length > 1){
    const sorted = _.groupBy(blogs, 'author')
    var max = -Infinity
    var index = -1
    _.forEach(sorted, (a, i) => {
      if (totalLikes(a)>max){
        max= totalLikes(a)
        index = i
      }
    })

    return (
      {
        author: sorted[index][0].author,
        likes: max
      }
    )
  }
  else if (blogs.length === 1){
    return (
      {
        author: blogs[0].author,
        likes: blogs[0].likes
      }
    )
  }
  else return {}
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}