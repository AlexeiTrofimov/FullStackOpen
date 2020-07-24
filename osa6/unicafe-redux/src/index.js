import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const StatisticLine = ({ text, value}) => {
  if (text === "positive"){
    return(
    <td>{text} {value} %</td>
    )
  }
  
  return(
    
    <td>{text} {value}</td>
    
  )
}

const Statistics = () => {
  
  const good = store.getState().good
  const neutral =store.getState().ok
  const bad = store.getState().bad

  const all = good + bad + neutral
  
  if (all === 0) {
    return(
      <div>
        No feedback given
      </div>
    )
  }
  
  return(
    
      <table>
        <tbody>
          <tr><StatisticLine text="good" value ={good} /></tr>
          <tr><StatisticLine text="neutral" value ={neutral} /></tr>
          <tr><StatisticLine text="bad" value ={bad} /></tr>
          <tr><StatisticLine text="all" value ={all} /></tr>
          <tr><StatisticLine text="average" value ={(good-bad)/all} /></tr>
          <tr><StatisticLine text="positive" value ={good/all*100} /></tr>
        </tbody>
    </table>
    
      
    
  )
}

const App = () => {
  const good = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }
  const neutral = () => {
    store.dispatch({
      type: 'OK'
    })
  }
  const bad = () => {
    store.dispatch({
      type: 'BAD'
    })
  }
  const zero = () => {
    store.dispatch({
      type: 'ZERO'
    })
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={good}>good</button> 
      <button onClick={neutral}>neutral</button> 
      <button onClick={bad}>bad</button>
      <button onClick={zero}>reset stats</button>
    
      <h1>statistics</h1>  
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
