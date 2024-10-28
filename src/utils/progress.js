// src/utils/progress.js
/**
 * @fileoverview Progress tracking utility
 * @module progress
 */

import ora from 'ora';
import logger from './logger.js';

/**
 * @class ProgressTracker
 * @description Handles progress indication and status updates
 */
class ProgressTracker {
  constructor() {
    this.spinner = null;
  }

  /**
   * Starts progress tracking
   * @param {string} message - Initial message
   */
  start(message) {
    this.spinner = ora(message).start();
    logger.debug('Progress started', { message });
  }

  /**
   * Updates progress message
   * @param {string} message - New progress message
   */
  update(message) {
    if (this.spinner) {
      this.spinner.text = message;
      logger.debug('Progress updated', { message });
    }
  }

  /**
   * Marks progress as successful
   * @param {string} message - Success message
   */
  succeed(message) {
    if (this.spinner) {
      this.spinner.succeed(message);
      logger.info('Progress completed', { message });
    }
  }

  /**
   * Marks progress as failed
   * @param {string} message - Failure message
   */
  fail(message) {
    if (this.spinner) {
      this.spinner.fail(message);
      logger.error('Progress failed', { message });
    }
  }
}

export default new ProgressTracker();