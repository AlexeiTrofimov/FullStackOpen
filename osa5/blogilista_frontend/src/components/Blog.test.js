import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('Blog tests', () => {
  let component
  const changedBlog = jest.fn()

  beforeEach(() => {
    const blog = {
      'title': 'This is Test title',
      'author': 'Test person',
      'url': 'https://www.test.com',
      'likes': 8,
      'user': [{
        'name': 'Teemu Teekkari'
      }]

    }
    component = render(
      <Blog blog={blog} changedBlog={changedBlog} />
    )
  })

  test('renders only title and author', () => {
    const div = component.container.querySelector('.allInfo')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking view button all data is displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.allInfo')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking like button twice calls handler function twice', () => {
    const viewButton = component.getByText('view')
    const likeButton = component.getByText('like')

    fireEvent.click(viewButton)


    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(changedBlog.mock.calls.length).toBe(2)
  })

})