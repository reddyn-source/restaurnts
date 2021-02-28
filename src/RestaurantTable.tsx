import * as React from 'react'
import { createPortal } from 'react-dom'
import { FilterArray, FilterTypes, FilterItem, IRestuarnt, SortOrder } from './App.types'

import { ExtraInformation } from './ExtraInfo'

import './RestaurantTable.css'

type ITableProps = {
    restaurnts: IRestuarnt[]
    stateQuery: string,
    genreQuery: string,
    searchQuery: string,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    filterArray: FilterArray,
    onCoulumnHeaderClick: (event: React.MouseEvent<HTMLTableHeaderCellElement>) => void,
    sortColumn: string,
    sortOrder: string
}



type sortcolumn = 'name' | 'state'

enum paginationButton {
    left = "left",
    right = 'right'
}

export const RestaurntTable: React.FC<ITableProps> = (props: ITableProps) => {
    const {
        stateQuery = '',
        genreQuery = '',
        searchQuery = '',
        onInputChange,
        filterArray: filterRespectively,
        restaurnts,
        onCoulumnHeaderClick,
        sortColumn,
        sortOrder
    } = props

    const [startIndex, setStartIndex] = React.useState(0)
    const [openPopUp, setOpenPopUp] = React.useState(false)
    const [popUpContent, setPopUpContent] = React.useState<IRestuarnt>()
    const onRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
        const id = (event.currentTarget as HTMLTableRowElement).dataset['rowid']
        setPopUpContent(restaurnts.filter((item: IRestuarnt) => item.id === id)[0])
        setOpenPopUp(true)
    }
    const onClosePopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopUp(false)
    }
    const filteredRestaurnts = React.useMemo(() => {
        let locallyFilteredRestaurnts: IRestuarnt[] = []
        if (filterRespectively.length > 0) {
            filterRespectively.forEach((filterBy: FilterItem) => {
                const toUseArrayToFilter = locallyFilteredRestaurnts.length > 0 ? locallyFilteredRestaurnts : restaurnts
                if (filterBy === FilterTypes.byGenres) {
                    const filteredByGenres = toUseArrayToFilter.filter((item: IRestuarnt) => {
                        return item.genre.toLowerCase().includes(genreQuery.toLowerCase())
                    })
                    locallyFilteredRestaurnts = [...filteredByGenres]
                }
                else if (filterBy === FilterTypes.byState) {

                    const filteredByState = toUseArrayToFilter.filter((item: IRestuarnt) => {
                        return item.state.toLowerCase().includes(stateQuery.toLowerCase())
                    })
                    locallyFilteredRestaurnts = [...filteredByState]
                }
                else {
                    const filteredBySearch = toUseArrayToFilter.filter((item: IRestuarnt) => {
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
    }, [stateQuery, genreQuery, searchQuery, restaurnts, filterRespectively])


    const sortedRestaurants = [...filteredRestaurnts].sort((a: IRestuarnt, b: IRestuarnt) => {
        if (sortOrder === SortOrder.Ascending) {
            return a[sortColumn as sortcolumn].toUpperCase() > b[sortColumn as sortcolumn].toUpperCase() ? 1 : -1
        } else {
            return a[sortColumn as sortcolumn].toUpperCase() < b[sortColumn as sortcolumn].toUpperCase() ? 1 : -1
        }
    })

    const sortArrow = sortOrder === SortOrder.Ascending ? String.fromCharCode(8595) : String.fromCharCode(8593)

    const [currentPage, setCurrentPage] = React.useState(1)
    const maxPages = Math.ceil(filteredRestaurnts.length / 10)
    const onPaginationButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
        const arrow = (event.target as HTMLButtonElement).dataset['arrow']
        if (arrow === paginationButton.left) {
            setCurrentPage(currentPage - 1)
            setStartIndex(startIndex - 10)
        } else {
            setCurrentPage(currentPage + 1)
            setStartIndex(startIndex + 10)
        }
    }
    React.useEffect(() => {
        setCurrentPage(1)
        setStartIndex(0)
    }, [filteredRestaurnts])

    return (
        <>
            <div className="inputsearchcontainer">
                <div>
                    <b>
                        note:sort, search and filter will perform action on all pages instead of current page and will show the result
                    </b>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    data-field={FilterTypes.bySearch}
                    onChange={onInputChange}
                    placeholder={'search by name or city or genre'}
                    data-testid='searchbox'
                />
            </div>
            {
                <table>
                    <thead>
                        <tr>
                            <th
                                onClick={onCoulumnHeaderClick}
                                data-column={'name'}
                                data-sort={sortOrder}
                                data-testid="namecolumn"
                            >
                                {`Name  ${sortColumn === 'name' ? sortArrow : ''}`}
                            </th>
                            <th>City</th>
                            <th
                                onClick={onCoulumnHeaderClick}
                                data-column={'state'}
                                data-sort={sortOrder}
                                data-testid="statecolumn"
                            >
                                {`State  ${sortColumn === 'state' ? sortArrow : ''}`}
                            </th>
                            <th>Phone number</th>
                            <th>Genres</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td />
                            <td />
                            <td>
                                <input
                                    type="text"
                                    value={stateQuery}
                                    data-field={FilterTypes.byState}
                                    onChange={onInputChange}
                                    placeholder={'filter by state'}
                                    data-testid={'statefilter'}
                                />
                            </td>
                            <td />
                            <td>
                                <input
                                    type="text"
                                    value={genreQuery}
                                    data-field={FilterTypes.byGenres}
                                    onChange={onInputChange}
                                    placeholder={'filter by genre'}
                                    data-testid={'genrefilter'}
                                />
                            </td>
                        </tr>
                        {
                            (() => {
                                const item: React.ReactNode[] = []
                                for (let i = startIndex; i < startIndex + 10; i++) {
                                    if (i >= sortedRestaurants.length) break;
                                    item.push(
                                        <tr
                                            key={sortedRestaurants[i].id}
                                            onClickCapture={onRowClick}
                                            data-rowid={sortedRestaurants[i].id}
                                            tabIndex={0}
                                            data-testid="tablerow"
                                        >
                                            <td
                                                title={sortedRestaurants[i].name}
                                            >
                                                {sortedRestaurants[i].name}
                                            </td>
                                            <td
                                                title={sortedRestaurants[i].city}
                                            >
                                                {sortedRestaurants[i].city
                                                }
                                            </td>
                                            <td
                                                title={sortedRestaurants[i].state}
                                            >
                                                {sortedRestaurants[i].state}
                                            </td>
                                            <td
                                                title={sortedRestaurants[i].telephone}
                                            >
                                                {sortedRestaurants[i].telephone}
                                            </td>
                                            <td
                                                title={sortedRestaurants[i].genre}
                                            >
                                                {sortedRestaurants[i].genre}
                                            </td>
                                        </tr>
                                    )
                                }
                                return item
                            })()
                        }

                    </tbody>
                    {
                        maxPages > 0 && <tfoot>
                            <tr>
                                <td>
                                    <button
                                        onClick={onPaginationButtonClicked}
                                        data-arrow={paginationButton.left}
                                        disabled={currentPage === 1}
                                    >
                                        {'<'}
                                    </button>
                                    <span>{` ${currentPage} of ${maxPages}`} </span>
                                    <button
                                        onClick={onPaginationButtonClicked}
                                        data-arrow={paginationButton.right}
                                        disabled={currentPage === maxPages}
                                    >
                                        {'>'}
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    }

                </table>
            }
            {!!openPopUp && createPortal(<ExtraInformation
                onClose={onClosePopUp}
                data={popUpContent!}
            />, document.body)}
            {
                maxPages === 0 && (
                    <p className="noitem">
                        {'sorry no items to show please clear search 🤟'}
                    </p>
                )
            }
        </>
    )
}