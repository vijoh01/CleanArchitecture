export default function createLogger( { format, transports }) {
    const filePath = process.env.NODE_LOG_PATH;
    const { combine, printf, colorize, json } = format;
  
    const logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });
  
    const transportDevArray = [
        new transports.Console({
            level: 'http',
            format: combine(
              colorize(),
              logFormat
            )
        }),
        new transports.Console({
          level: 'error',
          format: combine(
            colorize(),
            logFormat
          )
      }),
        new transports.File({
            filename: filePath + '/error.log',
            handleExceptions: true,
            maxsize: 5242880, //5MB
            maxFiles: 5, 
            level: 'error',
            format: combine(
                json()
            )
          }),
        new transports.File({
            filename: filePath + '/all.log',
            handleExceptions: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            level: 'http',
            format: combine(
                json()
            )
        })
    ]
    
    const transportProdArray = [
        new transports.Console({
            level: 'http',
            format: combine(
              colorize(),
              logFormat
            )
        }),
        new transports.File({
            filename: filePath + '/error.log',
            handleExceptions: true,
            maxsize: 5242880, //5MB
            maxFiles: 5, 
            level: 'error',
            format: combine(
                json()
            )
          }),
        new transports.File({
            filename: filePath + '/all.log',
            handleExceptions: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            level: 'http',
            format: combine(
                json()
            )
        })
    ]
  
    return Object.freeze({ logger })
  
    function logger(){
        return process.env.NODE_ENV === 'development' ? transportDevArray : transportProdArray;
    }
  }