export type Restuarnt = {
    address1:string,
    attire:string,
    city:string,
    genre:string,
    hours:string,
    id:string,
    name:string,
    lat:string,
    long:string,
    state:string,
    tags:string,
    telephone:string,
    website:string,
    zip:string
  }

  export enum FilterTypes {
      byState = 'byState',
      byGenres = 'byGenres',
      bySearch = 'bySearch'
  }

  export type FilterItem = keyof typeof FilterTypes


  export type FilterArray =  Array<FilterItem>

