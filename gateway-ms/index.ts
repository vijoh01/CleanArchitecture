require('dotenv').config();

import { server } from './initializers/express';
import { logger } from './libs/logger';
import * as path from 'path';

const APP_NAME = process.env.NODE_NAME;
const NODE_HOSTNAME = process.env.NODE_HOSTNAME;
const NODE_PORT = process.env.NODE_PORT;

const filename = path.basename(__filename);

try {
    logger.info(`[${APP_NAME}] Bootstrapping micro service`);
   
    server({ hostname: NODE_HOSTNAME, port: NODE_PORT });
      
    logger.info(`[${APP_NAME}] Micro service bootstrapped successfully`);
} catch (error) {
    logger.error(`[${filename}] Caught exception: ${error}`);
}