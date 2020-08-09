import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logIn } from './../reducers/userReducer'

import {
  TextField,
  Button,
} from '@material-ui/core'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = (event) => {
    event.preventDefault()

    dispatch(logIn(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h3>login</h3>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )

}

export default LoginForm