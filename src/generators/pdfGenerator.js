// src/generators/pdfGenerator.js
/**
 * @fileoverview PDF Generation handler using PDFKit
 * @module pdfGenerator
 */

import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import styles from '../config/pdfStyles.js';
import logger from '../utils/logger.js';

/**
 * @class PDFGenerator
 * @description Handles PDF document generation with formatting and structure
 */
class PDFGenerator {
  /**
   * Creates a new PDFGenerator instance with configured document settings
   * @constructor
   */
  constructor() {
    this.doc = new PDFDocument({
      margins: styles.page.margin,
      autoFirstPage: true
    });
    this.pageNumber = 1;
    this.currentY = styles.page.margin.top + styles.page.padding;
  }

  /**
   * Generates PDF from content
   * @async
   * @param {Array} content - Structured content to convert to PDF
   * @param {string} outputPath - Path where PDF will be saved
   * @returns {Promise<void>}
   */
  async generate(content, outputPath) {
    try {
      await this.generateContent(content);
      return this.finalizeDocument(outputPath);
    } catch (error) {
      logger.error('PDF generation failed', { error });
      throw error;
    }
  }

  /**
   * Processes and adds content to PDF
   * @private
   * @param {Array} content - Content elements to add
   */
  /**
* Processes and adds content to PDF
* @private
* @param {Array} content - Content elements to add
*/
  async generateContent(content) {
    for (const element of content) {
      // Only add new page if we need it
      if (this.currentY + this.calculateContentHeight(element) > this.doc.page.height - this.doc.page.margins.bottom) {
        this.doc.addPage();
        this.pageNumber++;
        this.currentY = styles.page.margin.top + styles.page.padding;
      }

      switch (element.type) {
        case 'heading':
          await this.addHeading(element);
          break;
        case 'paragraph':
          await this.addParagraph(element);
          break;
        case 'quote':
          await this.addQuote(element);
          break;
        case 'code':
          await this.addCode(element);
          break;
        default:
          logger.warn('Unsupported element type', { type: element.type });
      }
    }
  }


  /**
   * Calculates approximate content height
   * @private
   * @param {Object} element - Content element
   * @returns {number} Approximate height in points
   */
  calculateContentHeight(element) {
    const width = this.doc.page.width - this.doc.page.margins.left - this.doc.page.margins.right;
    let height = 0;

    switch (element.type) {
      case 'heading':
        height = styles.heading[element.level].fontSize * 1.5;
        break;
      case 'paragraph':
        height = this.doc.heightOfString(element.content, { width }) + styles.text.paragraph.spacing;
        break;
      case 'quote':
        height = this.doc.heightOfString(element.content, { width: width - styles.text.quote.indent })
          + styles.text.quote.spacing;
        break;
      case 'code':
        height = this.doc.heightOfString(element.content, { width }) + styles.text.code.spacing;
        break;
    }

    return height;
  }

  /**
   * Adds a heading to the PDF
   * @private
   * @param {Object} element - Heading element
   */
  addHeading(element) {
    const style = styles.heading[element.level];
    this.doc
      .font(styles.fonts.bold)
      .fontSize(style.fontSize)
      .fillColor(style.color);

    this.doc.text(element.content, {
      continued: false
    });

    this.currentY += style.fontSize + style.spacing;
  }

  /**
   * Adds a paragraph to the PDF
   * @private
   * @param {Object} element - Paragraph element
   */
  /**
 * Adds a paragraph to the PDF
 * @private
 * @param {Object} element - Paragraph element
 */
  addParagraph(element) {
    const style = styles.text.paragraph;
    this.doc
      .font(styles.fonts.regular)
      .fontSize(style.fontSize)
      .fillColor(styles.colors.text)
      .text(element.content, {
        continued: false,
        lineGap: style.fontSize * (style.lineHeight - 1),
        paragraphGap: style.spacing
      });

    this.currentY += this.doc.heightOfString(element.content, {
      lineGap: style.fontSize * (style.lineHeight - 1)
    }) + style.spacing;
  }

  /**
   * Adds a blockquote to the PDF
   * @private
   * @param {Object} element - Quote element
   */
  addQuote(element) {
    const style = styles.text.quote;
    this.doc
      .font(styles.fonts.italic)
      .fontSize(style.fontSize)
      .fillColor(styles.colors.quote);

    this.doc.text(element.content, {
      indent: style.indent,
      continued: false
    });

    this.currentY += this.doc.heightOfString(element.content) + style.spacing;
  }

  /**
   * Adds a code block to the PDF
   * @private
   * @param {Object} element - Code element
   */
  addCode(element) {
    const style = styles.text.code;

    // Add background rectangle
    const codeHeight = this.doc.heightOfString(element.content) + 10;
    this.doc
      .rect(
        this.doc.page.margins.left,
        this.currentY,
        this.doc.page.width - this.doc.page.margins.left - this.doc.page.margins.right,
        codeHeight
      )
      .fill('#f6f8fa');

    // Add code text
    this.doc
      .font(styles.fonts.code)
      .fontSize(style.fontSize)
      .fillColor(styles.colors.code);

    this.doc.text(element.content, {
      continued: false
    });

    this.currentY += codeHeight + style.spacing;
  }

  /**
   * Finalizes and saves the PDF document
   * @private
   * @param {string} outputPath - Path to save PDF
   * @returns {Promise<void>}
   */
  finalizeDocument(outputPath) {
    return new Promise((resolve, reject) => {
      const stream = this.doc.pipe(createWriteStream(outputPath));
      stream.on('finish', () => {
        logger.info('PDF document finalized', { outputPath });
        resolve();
      });
      stream.on('error', reject);
      this.doc.end();
    });
  }
}

export default PDFGenerator;