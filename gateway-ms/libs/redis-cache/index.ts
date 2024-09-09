import {
  setCache as makeSetCache,
  getCache as makeGetCache
} from '../../initializers/redis-cache';
import redisCache from './redis.cache';

const setCache = ({ data, cacheKey }) =>
  redisCache({ makeSetCache, makeGetCache }).setCache({ data, cacheKey});

const getCache = ({ cacheKey }) =>
  redisCache({ makeGetCache, makeSetCache }).getCache({ cacheKey });


export {
  setCache,
  getCache
}