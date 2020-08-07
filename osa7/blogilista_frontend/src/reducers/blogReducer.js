import blogService from './../services/blogs'
import { setNotification } from './notificationReducer'

export const createBlog = (content) => {
  return async dispatch => {
    try{
      const newBlog = await blogService.create(content)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })
      dispatch(setNotification(`you added '${newBlog.title}'`, 'success', 5))
    }
    catch{
      dispatch(setNotification('All fields must be filled', 'error', 5))
    }
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}


export const likeBlog = (blog) => {
  return async dispatch => {
    await blogService.update(blog)
    dispatch({
      type: 'LIKE_BLOG',
      data: blog
    })
  }
}

export const commentBlog = (blog, comment) => {
  return async dispatch => {
    await blogService.update(blog)
    dispatch({
      type: 'COMMENT_BLOG',
      data: blog,
      comment: comment
    })
  }
}

export const deleteBlog = (id, blogs) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: blogs,
      id: id
    })
  }
}

const blogReducer = (state = [], action) => {
  switch(action.type) {

  case 'NEW_BLOG':
    return [...state, action.data]

  case 'INIT_BLOGS':
    return action.data

  case 'LIKE_BLOG':
    const likedId = action.data.id
    const blogToChange = action.data
    const likedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1
    }
    return state.map(blog =>
      blog.id !== likedId ? blog : likedBlog
    )
  case 'COMMENT_BLOG':
    const commentedId = action.data.id
    const blogToComment = action.data
    const commentedBlog = {
      ...blogToComment,
      comments: [...blogToComment.comments, action.comment]
    }
    return state.map(blog =>
      blog.id !== commentedId ? blog : commentedBlog
    )
  case 'DELETE_BLOG':
    return action.data.filter(blog => blog.id !== action.id)

  default:
    return state
  }
}

export default blogReducer