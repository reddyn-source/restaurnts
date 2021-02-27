import * as React from 'react'
import { FilterArray,FilterTypes, FilterItem, Restuarnt } from './App.types'

type ITableProps = {
    restaurnts: Restuarnt[]
    stateQuery: string,
    genreQuery: string,
    searchQuery:string,
    onInputChange:(event: React.ChangeEvent<HTMLInputElement>) => void
    filterArray: FilterArray
}

export const RestaurntTable: React.FC<ITableProps> = (props: ITableProps) => {
    const { stateQuery = '', genreQuery = '' , searchQuery='', onInputChange, filterArray:filterRespectively ,restaurnts } = props
    const filteredRestaurnts = React.useMemo(() => {
    let  locallyFilteredRestaurnts:Restuarnt[] = []
      if(filterRespectively.length>0){
         filterRespectively.forEach((filterBy:FilterItem)=>{
            if(filterBy === FilterTypes.byGenres) {
                const toUseArrayToFilter =  locallyFilteredRestaurnts.length>0 ?locallyFilteredRestaurnts : restaurnts
                 const filteredByGenres =  toUseArrayToFilter.filter((item:Restuarnt)=>{
                    return item.genre.toLowerCase().includes(genreQuery.toLowerCase())
                })
                locallyFilteredRestaurnts = [...filteredByGenres]
            }  
            else if(filterBy === FilterTypes.byState) {
                const toUseArrayToFilter =  locallyFilteredRestaurnts.length>0 ?locallyFilteredRestaurnts : restaurnts
                const filteredByState =  toUseArrayToFilter.filter((item:Restuarnt)=>{
                    return item.state.toLowerCase().includes(stateQuery.toLowerCase())
                })
                locallyFilteredRestaurnts = [...filteredByState]
            } 
            else {
                const toUseArrayToFilter =  locallyFilteredRestaurnts.length>0 ?locallyFilteredRestaurnts : restaurnts
                const filteredBySearch =  toUseArrayToFilter.filter((item:Restuarnt)=>{
                    return (
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ||
                        item.city.toLowerCase().includes(searchQuery.toLowerCase())
                        ||
                        item.genre.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                })
                locallyFilteredRestaurnts = [...filteredBySearch]
            }
        })
        return locallyFilteredRestaurnts
      } else {
        return restaurnts
      }
    }, [stateQuery, genreQuery, searchQuery])
    const sortedRestaurants = [...filteredRestaurnts].sort((a: Restuarnt, b: Restuarnt) => {
        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
    })
    return (
        <>
        <input type="text" value={searchQuery} data-field={FilterTypes.bySearch} onChange={onInputChange}/>
            {
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Phone number</th>
                            <th>Genres</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td />
                            <td />
                            <td>
                                <input type="text" value={stateQuery} data-field={FilterTypes.byState} onChange={onInputChange} />
                            </td>
                            <td />
                            <td>
                                <input type="text" value={genreQuery}  data-field={FilterTypes.byGenres} onChange={onInputChange}  />
                            </td>
                        </tr>
                        {
                            sortedRestaurants.map((restaurant: Restuarnt) => {
                                return (
                                    <tr key={restaurant.id}>
                                        <td>{restaurant.name}</td>
                                        <td>{restaurant.city}</td>
                                        <td>{restaurant.state}</td>
                                        <td>{restaurant.telephone}</td>
                                        <td>{restaurant.genre}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            }
        </>
    )
}