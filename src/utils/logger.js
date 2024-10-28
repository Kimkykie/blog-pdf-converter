// src/utils/logger.js
/**
 * @fileoverview Logging utility for the application
 * @module logger
 */

import { createLogger, format as _format, transports as _transports } from 'winston';

/**
 * Custom logger configuration
 * @type {winston.Logger}
 */
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: _format.combine(
    _format.timestamp(),
    _format.json()
  ),
  transports: [
    new _transports.Console({
      format: _format.combine(
        _format.colorize(),
        _format.simple()
      )
    }),
    new _transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new _transports.File({
      filename: 'combined.log'
    })
  ]
});

export default logger;