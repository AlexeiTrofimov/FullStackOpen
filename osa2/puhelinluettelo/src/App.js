import React, { useState } from 'react'

const Persons = ({persons, searchedName}) => {
  
  const filtered = () => persons.filter((person) => person.name.toLowerCase().includes(searchedName.toLowerCase()))

  return(    
    filtered().map(person => 
    <p key={person.name}>{person.name} {person.number}</p>
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
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [searchedName, setSearchedName ] = useState('')

  const addData = (event) => {
    event.preventDefault()

    const newData = {
      name : newName,
      number: newNumber
    }

    if (persons.find(person => person.name === newData.name)) {
      window.alert(`${newName} is already added to phonebook`);
    }
    else{
      setPersons(persons.concat(newData))
      setNewName('')
      setNewNumber('')
    }
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
      <Filter searchName={searchName} searchedName={searchedName} 
      handleSearch={handleSearch}/>
      <h2>add a new</h2>
        <NewDataForm addData={addData} newNumber={newNumber}
        newName={newName} handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} searchedName={searchedName} />
      
      
    </div>
  )

}

export default App