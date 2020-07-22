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

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  var showIfLogged = { display: 'none' }

  if (blog.user[0].username === username ){
    showIfLogged = { display: '' }
  }


  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.title} {blog.author}
          <button onClick={toggleVisibility}>close</button>
        </p>
        <p>{blog.url}</p>
        <p>likes {blog.likes}
          <button onClick={giveLike}>like</button>
        </p>
        <p>{blog.user[0].name}</p>
        <div style={showIfLogged}>
          <p><button onClick={() => deleteBlog(blog.id)}>remove</button></p>
        </div>
      </div>
    </div>
  )
}


export default Blog
