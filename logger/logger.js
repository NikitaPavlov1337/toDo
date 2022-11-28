import { createLogger, format, transports } from 'winston';

/**
 * Represents a Logger.
 */

const logger = createLogger({
	transports:
					new transports.File({
						filename: 'logger/server.log',
						format: format.combine(
							format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
							format.align(),
							format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message} `)
						)
					})
});
export default logger;
