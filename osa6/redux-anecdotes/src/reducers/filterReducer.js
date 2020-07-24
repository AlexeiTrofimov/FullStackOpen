export const filterAnecdotes= (searchedWord) => {
  return {
    type: 'FILTER',
    data: searchedWord
  }

}

const FilterReducer = (state = '', action) => {
  switch(action.type) {

  case 'FILTER':
    return action.data

  default:
    return state
  }
}

export default FilterReducer