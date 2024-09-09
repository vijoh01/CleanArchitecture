import {
    setCache as makeSetCache,
    getCache as makeGetCache
  } from '../libs/redis-cache';
  
  import createFetch from './fetch';
  
  const setCache = ({ data, cacheKey, cacheConfig }) => makeSetCache({ data, cacheKey, cacheConfig });
  
  
  const getCache = ({ cacheKey, cacheConfig }) => makeGetCache({ cacheKey, cacheConfig });
  
  
  const makeFetch = ({ params, path, headers, method }) => createFetch().makeFetch({ params, headers, path, method});
  
  
  
  export {
    setCache,
    getCache,
    makeFetch
  }