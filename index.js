// index.js
/**
 * @fileoverview Main entry point for the webpage-to-pdf converter
 * @module webpage-to-pdf
 */

import inquirer from 'inquirer';
import { join } from 'path';
import extractContent from './src/extractors/contentExtractor.js';
import PDFGenerator from './src/generators/pdfGenerator.js';
import FileNamer from './src/utils/fileNamer.js';
import logger from './src/utils/logger.js';
import progress from './src/utils/progress.js';

/**
 * Validates a URL string
 * @param {string} url - The URL to validate
 * @returns {boolean|string} True if valid, error message if invalid
 * @throws {Error} If validation fails unexpectedly
 */
async function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return 'Please enter a valid URL (including http:// or https://)';
  }
}

/**
 * Prompts user for webpage URL
 * @async
 * @returns {Promise<{url: string}>} Object containing the validated input URL
 * @throws {Error} If prompt fails or validation fails
 */
async function promptForUrl() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter the webpage URL to convert:',
      validate: validateUrl
    }
  ]);
}

/**
 * Converts a webpage to PDF format
 * @async
 * @description Main function that handles the entire conversion process:
 * 1. Gets URL input from user
 * 2. Extracts content from webpage
 * 3. Generates appropriate filename
 * 4. Creates PDF with formatted content
 * @throws {Error} If any step of the conversion process fails
 */
async function convertWebPageToPDF() {
  try {
    const { url } = await promptForUrl();
    progress.start('Starting conversion process...');

    progress.update('Extracting content from webpage...');
    const { title, elements } = await extractContent(url);
    progress.update('Generating filename...');

    const fileNamer = new FileNamer('./output');
    const fileName = await fileNamer.generateFileName(title);
    const outputPath = join('./output', fileName);

    progress.update('Generating PDF...');
    const pdfGenerator = new PDFGenerator();
    await pdfGenerator.generate(elements, outputPath);

    progress.succeed(`PDF generated successfully: ${fileName}`);

    logger.info('File details:', {
      location: outputPath,
      source: url,
      title: title || 'No title'
    });

  } catch (error) {
    progress.fail('Conversion failed');
    logger.error('Error during conversion:', error);
    throw error;
  }
}

/**
 * Self-executing async function to run the application
 * @async
 * @throws {Error} If application fails to execute
 */
(async () => {
  try {
    await convertWebPageToPDF();
  } catch (error) {
    console.error('Fatal error:', error);
    logger.error('Fatal error:', error);
    process.exit(1);
  }
})();

/**
 * @exports convertWebPageToPDF
 */
export { convertWebPageToPDF };