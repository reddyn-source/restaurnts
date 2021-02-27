import React from 'react';
import './App.css';
import { FilterArray, FilterTypes, FilterItem, Restuarnt } from './App.types'
import { RestaurntTable } from './RestaurantTable'

function App() {
  const [isLoading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<Restuarnt[]>([])
  const [filterValues, setFilterValues] = React.useState<FilterArray>([])
  const [stateQuery, setStateQuery] = React.useState('')
  const [genreQuery, setGenreQuery] = React.useState('')
  const [searchQuery,setSearchQuery] = React.useState('')
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const field = event.target.dataset['field'] as FilterItem
    const filterIndex = filterValues.indexOf(field)
    switch (field) {
      case FilterTypes.byGenres: setGenreQuery(value);
        break;
      case FilterTypes.byState: setStateQuery(value);
        break;
      case FilterTypes.bySearch:setSearchQuery(value);
      break;
      default: break;

    }
    if (value === '' && filterIndex > -1) {
      setFilterValues(filterValues.slice(0, filterIndex).concat(filterValues.slice(filterIndex +1, filterValues.length)))
    }
    if (value !== '' && filterIndex < 0) {
      setFilterValues([...filterValues, field])
    }

  }

  React.useEffect(() => {
    fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: 'Api-Key q3MNxtfep8Gt'
      }
    }).then((res) => res.json()).then((res: Restuarnt[]) => {
      setData(res)
      setLoading(false)
    })
  }, [])
  return (
    <div className="App">
      {
        isLoading ? 'iam loading' :
          <RestaurntTable
            restaurnts={data}
            stateQuery={stateQuery}
            genreQuery={genreQuery}
            searchQuery={searchQuery}
            onInputChange={onInputChange}
            filterArray={filterValues}
          />
      }
    </div>
  );
}

export default App;
