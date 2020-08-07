import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { setNotification } from './../reducers/notificationReducer'
import { likeBlog, commentBlog, deleteBlog } from './../reducers/blogReducer'


const Blog = ({ blog , blogs, username }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [comment, setComment] = useState('')

  const giveLike = () => {
    dispatch(likeBlog(blog))
    dispatch(setNotification(`you liked blog ${blog.title} by ${blog.author}`,'success', 5))
  }
  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      history.goBack()
      dispatch(deleteBlog(blog.id, blogs))
      dispatch(setNotification('Blog deleted successfully', 'success', 5))
    }
  }

  const handleComment = (event) => {
    event.preventDefault()

    dispatch(commentBlog(blog, comment))
    setComment('')
  }

  var showIfLogged = { display: 'none' }

  if (blog.user[0].username === username ){
    showIfLogged = { display: '' }
  }
  return (
    <div>
      <p><a href={blog.url}>{blog.url}</a></p>
      <p>likes {blog.likes}
        <button id="like-button" onClick={giveLike}>like</button>
      </p>
      <p>{blog.user[0].name}</p>
      <div style={showIfLogged}>
        <p><button onClick={removeBlog}>remove</button></p>
      </div>
      <h3>comments</h3>
      <div>
        <form onSubmit={handleComment}>
          <div>
            <input
              type="text"
              value={comment}
              id="comment"
              onChange={({ target }) => setComment(target.value)}
            />
            <button id="comment-button" type="submit"> add comment</button>
          </div>
        </form>
      </div>
      <ul>
        {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
      </ul>
    </div>
  )
}


export default Blog
