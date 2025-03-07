import { createLogger, format, transports, Logger } from 'winston';

const baseLogger = createLogger({
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
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({ filename: 'logs/app.log' })
    ],
    exitOnError: false
});

/**
 * Creates a logger instance with a predefined service name.
 * @param serviceName Name of the service to tag logs with.
 * @returns A Winston logger instance.
 */
export function createLoggerForService(serviceName: string): Logger {
    return baseLogger.child({ service: serviceName });
}

export default baseLogger; // Exporting default logger if needed globally
