require('dotenv').config();

const mongoose = require('mongoose');
import { server } from './initializers/express';
import { logger } from './libs/logger';
import * as path from 'path';

const APP_NAME = process.env.NODE_NAME;
const NODE_HOSTNAME = process.env.NODE_HOSTNAME;
const NODE_PORT = process.env.NODE_PORT;

const NODE_DATABASE_NAME = process.env.NODE_DATABASE_NAME;
const NODE_DATABASE_HOSTNAME = process.env.NODE_DATABASE_HOSTNAME;
const NODE_DATABASE_PORT = process.env.NODE_DATABASE_PORT;
const NODE_DATABASE_USERNAME = process.env.NODE_DATABASE_USERNAME;
const NODE_DATABASE_PASSWORD = process.env.NODE_DATABASE_PASSWORD;

const filename = path.basename(__filename);

try {
    logger.info(`[${APP_NAME}] Bootstrapping micro service`);
    const encodedPassword = encodeURIComponent(NODE_DATABASE_PASSWORD);
    
    const db_uri = `mongodb://${NODE_DATABASE_USERNAME}:${encodedPassword}@${NODE_DATABASE_HOSTNAME}:${NODE_DATABASE_PORT}/${NODE_DATABASE_NAME}`;
    console.log(db_uri, 'db_uri');
    
    mongoose.connect(db_uri)
        .then(() => {
            logger.info(`[${APP_NAME}] Database connection successful. ip: ${NODE_DATABASE_HOSTNAME} port: ${NODE_DATABASE_PORT}`);
            server({ hostname: NODE_HOSTNAME, port: NODE_PORT });
        })
        .catch((error) => {
            logger.error(`[${APP_NAME}] MongoDB connection error: ${error}`);
        });
} catch (error) {
    logger.error(`[${filename}] Caught exception: ${error}`);
}