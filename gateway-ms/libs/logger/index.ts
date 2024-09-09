import { format, createLogger, transports } from 'winston';
import createTransports from './transports'

const { combine, timestamp, errors } = format;
const ownTransports = (() => createTransports({ format, transports }).logger())()

const logger = createLogger({
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    ),
    defaultMeta: { service: process.env.NAME },
    transports: ownTransports
})


export { logger }