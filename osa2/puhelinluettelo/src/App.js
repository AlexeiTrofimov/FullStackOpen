import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      <p>{message}</p>
    </div>
  )
}

const ErrorMessage = ({ errorMsg }) => {
  if (errorMsg === null) {
    return null
  }

  return (
    <div className="error">
      <p>{errorMsg}</p>
    </div>
  )
}
const Persons = ({persons, searchedName, removeData}) => {
  
  const filtered = () => persons.filter((person) => person.name.toLowerCase().includes(searchedName.toLowerCase()))

  return(    
    filtered().map(person => 
    <p key={person.name}>{person.name} {person.number} 
    <button onClick={() => removeData(person)}>delete</button>
    </p>
    
    )
  )
}

const Filter = ({searchName, searchedName, handleSearch}) => {
  return (
    <form onSubmit={searchName}>
        <div>
          filter shown with <input value = {searchedName}
          onChange={handleSearch}
          />
        </div>

      </form>
  )
}

const NewDataForm = ({addData, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return(
  <form onSubmit={addData}>
        <div>
          name: <input value = {newName}
          onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input value = {newNumber}
          onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [searchedName, setSearchedName ] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  
  const addData = (event) => {
    event.preventDefault()

    const newData = {
      name : newName,
      number: newNumber
    }

    if (persons.find(person => person.name === newData.name)) {
      if (window.confirm(`${newData.name} is already added to phonebook, replace the old number with the new one?`)) {
        persons.forEach(person => {
          if (person.name === newData.name) {
            changeData(person.id, newData.number)
          }
        })
      }
      
    }
    else{
      personService
      .create(newData)
      .then(sentData => {
        setPersons(persons.concat(sentData))
        setNewName('')
        setNewNumber('')
        setMessage(`${newData.name} added succesfully`)
        setTimeout(()=> {
          setMessage(null)},3000) 
      })
      .catch(error => {
        setErrorMsg(error.response.data.error)
        setTimeout(()=> {
          setErrorMsg(null)},3000)  
      }) 
    }
  }

  const removeData = (person) => {
    const id = person.id
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(id)
        
        setPersons(persons.filter(person => person.id !== id))
        
        setMessage(`${person.name} removed succesfully`)
        setTimeout(()=> {
          setMessage(null)},3000) 
    }
  }

  const changeData = (id, newNumber) => {
    const person = persons.find(p => p.id === id)
    const changedData = { ...person, number: newNumber }

    personService
      .update(id, changedData)
        .then(returnedData => {
        setPersons(persons.map(person => person.id !== id ? person : returnedData))
        setMessage(`${person.name}'s number changed succesfully`)
        setTimeout(()=> {
          setMessage(null)},3000) 
      }).catch(error => {
        setErrorMsg(`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(person => person.id !== id))
        setTimeout(()=> {
          setErrorMsg(null)},3000) 
        })
    setNewName('')
    setNewNumber('')
      
      
  }

  const searchName = (event) => {
    event.preventDefault()

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearch = (event) => {
    setSearchedName(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorMessage errorMsg={errorMsg} />
      <Filter searchName={searchName} searchedName={searchedName} 
      handleSearch={handleSearch}/>
      <h2>add a new</h2>
        <NewDataForm addData={addData} newNumber={newNumber}
        newName={newName} handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} searchedName={searchedName}
      removeData={removeData} />
      
      
    </div>
  )

}

export default App