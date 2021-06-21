import { get, post, put, del, uploader } from './request'
export const GetAllCountries = (params) => get('https://restcountries.eu/rest/v2/all', params, false)
export const SearchCountries = (params) => get(`https://restcountries.eu/rest/v2/name/${params.searchKeywords}?fullText=false`, params, false)