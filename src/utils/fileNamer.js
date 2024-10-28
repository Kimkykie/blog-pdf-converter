// src/utils/fileNamer.js
/**
 * @fileoverview Handles file naming and path management
 * @module fileNamer
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import logger from './logger.js';

/**
 * @class FileNamer
 * @description Manages file naming and ensures unique filenames
 */
class FileNamer {
  /**
   * Creates a new FileNamer instance
   * @param {string} outputDir - Directory for output files
   */
  constructor(outputDir = './output') {
    this.outputDir = outputDir;
  }

  /**
   * Generates a unique filename based on page title
   * @async
   * @param {string} title - Page title to base filename on
   * @returns {Promise<string>} Generated filename
   */
  async generateFileName(title) {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });

      const baseName = this.sanitizeTitle(title);
      let increment = 0;
      let fileName;

      do {
        fileName = increment === 0
          ? `${baseName}.pdf`
          : `${baseName}_${increment}.pdf`;
        increment++;
      } while (await this.fileExists(fileName));

      logger.debug('Generated filename', { fileName });
      return fileName;
    } catch (error) {
      logger.error('Error generating filename', { error });
      throw error;
    }
  }

  /**
   * Checks if file exists
   * @private
   * @async
   * @param {string} fileName - Name of file to check
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(fileName) {
    try {
      await fs.access(join(this.outputDir, fileName));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitizes title for use as filename
   * @private
   * @param {string} title - Title to sanitize
   * @returns {string} Sanitized title
   */
  sanitizeTitle(title) {
    return (title || 'webpage')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_')
      .slice(0, 200);
  }
}

export default FileNamer;