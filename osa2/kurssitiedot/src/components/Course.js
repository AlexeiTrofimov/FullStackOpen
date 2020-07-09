import React from 'react'

const Course = ({course}) => {
    return (
      <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>   
      <Total parts={course.parts}/>
      </div>
    )
  }

  const Header = (props) => {
    return (
      <div>
          <h2>
            {props.course}
          </h2>
      </div>
    )
  }
  
  const Part = ({part}) => {
    return (
      <div>
          <p>
            {part.name} {part.exercises}
          </p>
      </div>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => 
            <Part key={part.id} part={part} />            
        )}
      </div>
      
    )
  }
  
  const Total = ({parts}) => {
    
    const sum = parts.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue.exercises
    }, 0)
   
    return (
      <div>
          <h4>
            total of {sum} exercises
          </h4>
      </div>
    )
    
  }

  export default Course