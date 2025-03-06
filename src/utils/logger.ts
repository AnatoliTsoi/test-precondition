import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [

        new transports.Console({
            format: format.combine(
                format.colorize(), // Colorize output for easier reading on the console
                format.simple()
            )
        }),

        new transports.File({ filename: 'logs/app.log' })
    ],
    exitOnError: false
});

export default logger;
