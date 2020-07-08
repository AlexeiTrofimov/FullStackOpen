import React, {useState} from 'react'
import ReactDOM from 'react-dom'


const StatisticLine = (props) => {
  if (props.text === "positive"){
    return(
    <td>{props.text} {props.value} %</td>
    )
  }
  
  return(
    
    <td>{props.text} {props.value}</td>
    
  )
}

const Statistics = ({good, bad, neutral}) => {
  
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

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
)

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={() => setGood(good+1)} text="good" />
        <Button handleClick={() => setNeutral(neutral+1)} text="neutral" />
        <Button handleClick={() => setBad(bad+1)} text="bad" />
      </div>
      <h1>statistics</h1>
      
      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))