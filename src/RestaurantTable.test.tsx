import React from 'react';
import { render, screen,fireEvent, getAllByAltText } from '@testing-library/react';
import { restaurnts } from './mockdata'
import { RestaurntTable } from './RestaurantTable'
import { SortOrder } from './App.types'

test('renders restaurnt table', () => {
    render(<RestaurntTable
        restaurnts={restaurnts}
        stateQuery={''}
        genreQuery={''}
        searchQuery={''}
        onInputChange={jest.fn()}
        filterArray={[]}
        onCoulumnHeaderClick={jest.fn()}
        sortColumn={'name'}
        sortOrder={SortOrder.Ascending}
    />);
    expect(screen.getAllByTestId('tablerow').length).toBe(10)
});


test('triggers all the  filters and searchs and sortings', () => {
    const onInputChange = jest.fn(()=>{})
    const onCoulumnHeaderClick = jest.fn(()=>{})
    render(<RestaurntTable
        restaurnts={restaurnts}
        stateQuery={''}
        genreQuery={''}
        searchQuery={''}
        onInputChange={onInputChange}
        filterArray={[]}
        onCoulumnHeaderClick={onCoulumnHeaderClick}
        sortColumn={'name'}
        sortOrder={SortOrder.Ascending}
    />);
   fireEvent.change(screen.getAllByTestId('searchbox')[0],{target:{value:'qa'}})
    expect(onInputChange).toHaveBeenCalledTimes(1)
    fireEvent.change(screen.getAllByTestId('genrefilter')[0],{target:{value:'qsfa'}})
    expect(onInputChange).toHaveBeenCalledTimes(2)
    fireEvent.change(screen.getAllByTestId('statefilter')[0],{target:{value:'qsfa'}})
    expect(onInputChange).toHaveBeenCalledTimes(3)
    fireEvent.click(screen.getAllByTestId('statecolumn')[0])
    expect(onCoulumnHeaderClick).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getAllByTestId('namecolumn')[0])
    expect(onCoulumnHeaderClick).toHaveBeenCalledTimes(2)
});

