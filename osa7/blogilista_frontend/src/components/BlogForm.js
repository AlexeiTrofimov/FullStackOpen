import React from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from './../reducers/blogReducer'

import Togglable from './Togglable'
import CreateNew from './NewBlog'

const BlogForm = () => {
  const dispatch = useDispatch()

  const addBlog = async (newBlog) => {
    dispatch(createBlog(newBlog))
  }

  return (
    <Togglable buttonLabel='new note'>
      <CreateNew
        createBlog={addBlog}
      />
    </Togglable>
  )
}

export default BlogForm