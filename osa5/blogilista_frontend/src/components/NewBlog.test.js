import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlog from './NewBlog'

test('posting new blog calls for handler function with right info', () => {
  const createBlog = jest.fn()

  const component = render(
    <NewBlog createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const form = component.container.querySelector('form')

  fireEvent.change(title, { target: { value: 'Test title' } })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test title' )
})