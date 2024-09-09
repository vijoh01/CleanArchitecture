import { logger } from '../libs/logger';
import createAuth from './auth';
import createRegister from './register';
import createRetrieveUser from './retriveUser';
import createProtected from './protected';
const cacheConfig = Object.freeze({
    host: process.env.REDIS_DB_HOST,
    port: process.env.REDIS_DB_PORT,
    ttl: parseInt(process.env.REDIS_DB_TTL),
    cacheKeyPrefix: `${ process.env.NODE_NAME }:`
})

import {
    setCache,
    getCache,
    makeFetch
  } from '../data-access';
import createTokenRefresh from './tokenRefresh';
import createUpdateUser from './updateUser';

const registerUser = createRegister({
    makeFetch, logger
}).register;

const authUser = createAuth({
    cacheConfig, setCache, makeFetch, logger
}).auth;

const retriveUser = createRetrieveUser({
    getCache, makeFetch, logger
}).retriveUser;

const updateUser = createUpdateUser({
    makeFetch, logger
}).updateUser;

const protectedRoute = createProtected({
    getCache, logger, cacheConfig
}).protectedRoute;

const refresh = createTokenRefresh({
    getCache, setCache, logger, cacheConfig, makeFetch
}).checkAccessToken;

export { registerUser, authUser, retriveUser, protectedRoute, refresh, updateUser }