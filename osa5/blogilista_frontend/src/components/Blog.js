import React, { useState } from 'react'


const Blog = ({ blog, changedBlog,deleteBlog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const giveLike = () => {
    changedBlog(blog.id,
      {
        'user': blog.user[0].id,
        'title': blog.title,
        'author': blog.author,
        'url': blog.url,
        'likes': blog.likes + 1
      })
  }
  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  const [visible, setVisible] = useState(false)
  const [buttonText, setButtonText] = useState('view')

  const showWhenVisible = { display: visible ? '' : 'none' }

  var showIfLogged = { display: 'none' }

  if (blog.user[0].username === username ){
    showIfLogged = { display: '' }
  }

  const toggleVisibility = () => {
    setVisible(!visible)
    if (buttonText === 'view'){
      setButtonText('close')
    }
    else(
      setButtonText('view')
    )
  }

  return (
    <div style={blogStyle} >
      <div id="shortInfo">
        {blog.title} {blog.author}
        <button id="info-button" onClick={toggleVisibility}>{buttonText}</button>
      </div>
      <div style={showWhenVisible} className="allInfo">
        <p>{blog.url}</p>
        <p>likes {blog.likes}
          <button id="like-button" onClick={giveLike}>like</button>
        </p>
        <p>{blog.user[0].name}</p>
        <div style={showIfLogged}>
          <p><button onClick={removeBlog}>remove</button></p>
        </div>
      </div>
    </div>
  )
}


export default Blog
