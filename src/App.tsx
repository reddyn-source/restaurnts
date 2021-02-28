import React from 'react';
import './App.css';
import { FilterArray, FilterTypes, FilterItem, IRestuarnt, SortOrder } from './App.types'
import { RestaurntTable } from './RestaurantTable'

function App() {
  const [isLoading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<IRestuarnt[]>([])
  const [filterValues, setFilterValues] = React.useState<FilterArray>([])
  const [stateQuery, setStateQuery] = React.useState('')
  const [genreQuery, setGenreQuery] = React.useState('')
  const [searchQuery,setSearchQuery] = React.useState('')
  const [sortColumn, setSortCoumn] = React.useState<'name' | 'state'>('name')
  const [sortOrder,setSortOrder] = React.useState<keyof typeof SortOrder>(SortOrder.Ascending)
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

  const onCoulumnHeaderClick = (event:React.MouseEvent<HTMLTableHeaderCellElement>) => {
     const column = (event.target as HTMLTableCellElement ).dataset['column']
     const order =   (event.target as HTMLTableCellElement ).dataset['sort']
     setSortCoumn(column as 'name' | 'state') 
     setSortOrder(order ===SortOrder.Ascending ? SortOrder.Desending: SortOrder.Ascending)
  }

  React.useEffect(() => {
    fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: 'Api-Key q3MNxtfep8Gt'
      }
    }).then((res) => res.json()).then((res: IRestuarnt[]) => {
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
            onCoulumnHeaderClick={onCoulumnHeaderClick}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
          />
      }
    </div>
  );
}

export default App;
