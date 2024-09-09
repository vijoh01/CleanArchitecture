import * as Redis from 'redis';
import { logger } from '../../libs/logger';
import cacheManager from './redis-cache'

const cacheConfig = Object.freeze({
    url: `redis://${process.env.REDIS_DB_HOST}`,
    port: process.env.REDIS_DB_PORT,
    ttl: parseInt(process.env.REDIS_DB_TTL),
    cacheKeyPrefix: `${ process.env.NODE_NAME }:`
})

const setCache = ({ data, cacheKey }) =>
	cacheManager({ Redis, logger, cacheConfig }).setCache({ data, cacheKey });

const getCache = ({ cacheKey }) =>
	cacheManager({ Redis, logger, cacheConfig }).getCache({ cacheKey });

export {
	setCache,
	getCache
}