import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const Display = (props) => {
  return (
    <div>
    <p>{props.anecdotes[props.index]}</p>
    <p>has {props.points[props.index]} votes</p>
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(6).fill(0));
  const [best, setBest] = useState(0)

  const numberGenerator = () => {
    
    setSelected(Math.floor((Math.random()*6)))
    setBest(points.indexOf(Math.max(...points))) 
    
  }
  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }
  
  return (
    
    <div>
      <h1>Anecdote of the day</h1>
      <Display anecdotes={props.anecdotes} points={points}
        index={selected} />
      
      <Button handleClick={vote}text="vote"/>
      <Button handleClick={numberGenerator }text="next anecdote" />
      
      <h1>Anecdote with most votes</h1>    
      <Display anecdotes={props.anecdotes} points={points}
        index={best} />
       
    </div>
    
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]


ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)