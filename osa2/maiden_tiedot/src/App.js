import React, {useState, useEffect} from 'react';
import axios from 'axios'



const Weather = (props) => {
  const [weather, setWeather] = useState(null)
  const params = {
    access_key: process.env.REACT_APP_API_KEY,
    query: props.city
  }
  
  
  useEffect(() => {
    let mounted = true
    axios
      .get('http://api.weatherstack.com/current', {params})
      .then(response => {
        if (mounted){
        setWeather(response.data)
        }
      })
      return () => {
        mounted = false;
      }
  }, [props.city, params])
  

  if (weather) {
    return (
        <div>
          <h2>Weather in {props.city}</h2>
          <p><b>Current temperature: </b>{weather.current.temperature} °C</p>
          <p><b>Feels like: </b> {weather.current.feelslike} °C</p>
          <img id="weather" src={weather.current.weather_icons} width='100' alt='weather icon'/>
        </div>
    )
} else {
    return (
      <div>
        Loading Weather...
      </div>
    )
  }
}


const MoreData = ({filtered}) => {
  const country = filtered
  const languages = country.languages

    return(
      <div>
        <h1>{country.name}</h1>
        <p>capital: {country.capital}</p>
        <p>population: {country.population}</p>
        <h2>languages</h2>
      <ul>
      {languages.map(language => 
        <li key={language.name}>{language.name}</li>
        )}
      </ul>
      <img id="flag" src={country.flag} width='200' alt='countrys flag'/>
      
      <h1>Current weather</h1>
      <Weather city={country.capital}/>      
      </div>
        
      
    )
}



const Countries = ({countries, searchedCountry}) => {
  
  const filtered = () => countries.filter((country) => 
  country.name.toLowerCase().includes(searchedCountry.toLowerCase()))

  if (filtered().length >= 10){
    return (
        <p>too many countries</p>     
    )
  }
  else if (filtered().length === 1){
    
    
    return(
    <MoreData filtered={filtered()[0]}/>
    )
  }

  else{
    return(    
      filtered().map(country => 
      <p key={country.name}>{country.name} </p>
      )
      
      
    )
  }
}


function App() {
  const [countries, setCountries] = useState([])
  const [searchedCountry, setSearchedCountry] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])


  const searchCountry = (event) => {
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchedCountry(event.target.value)
  }

    return (
      <div >
        <form onSubmit={searchCountry} >
          <div>
            find countries <input value={searchedCountry}
            onChange={handleSearchChange}
            />
          </div>

        </form>
        <Countries countries={countries} searchedCountry={searchedCountry} />
      </div>
    )
}

export default App;
