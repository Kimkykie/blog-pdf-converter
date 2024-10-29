// src/generators/pdfGenerator.js
/**
 * @fileoverview PDF Generation handler using PDFKit
 * @module pdfGenerator
 */

import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import styles from '../config/pdfStyles.js';
import logger from '../utils/logger.js';
import { loadFonts } from '../utils/fontHelper.js';

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
    this.fonts = loadFonts(this.doc);
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
        const headingStyle = styles.heading[element.level];
        height = this.doc.heightOfString(element.content) + (headingStyle.spacing * 2.5);
        break;
      case 'paragraph':
        height = this.doc.heightOfString(element.content, { width }) + styles.text.paragraph.spacing;
        break;
      case 'quote':
        height = this.doc.heightOfString(element.content, {
          width: width - styles.text.quote.indent * 2
        }) + (styles.text.quote.spacing * 2);
        break;
      case 'code':
        const verticalPadding = 15;
        height = this.doc.heightOfString(element.content, {
          width: width - 30  // account for horizontal padding
        }) + (verticalPadding * 2) + (styles.text.code.spacing * 2);
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
      .font(this.fonts.main.bold)
      .fontSize(style.fontSize)
      .fillColor(style.color);

    this.doc.text(element.content, {
      continued: false,
      lineGap: style.fontSize * 0.3,
    });

    this.currentY += this.doc.heightOfString(element.content) + (style.spacing * 2.5);
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
      .font(this.fonts.main.regular)
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
    const quoteWidth = this.doc.page.width - (style.indent * 2) - this.doc.page.margins.left - this.doc.page.margins.right;

    // Quote text with styling
    this.doc
      .font(this.fonts.main.italic)
      .fontSize(style.fontSize)
      .fillColor(styles.colors.quote);

    // Add the quote text
    this.doc.x = this.doc.page.margins.left + style.indent;

    this.doc.text(element.content, {
      width: quoteWidth,
      align: 'left',
      lineGap: style.fontSize * 0.5,
    });

    // Calculate height and update currentY
    const textHeight = this.doc.heightOfString(element.content, {
      width: quoteWidth,
      lineGap: style.fontSize * 0.5
    });

    this.currentY += textHeight + style.spacing;

    // Reset position
    this.doc.x = this.doc.page.margins.left;
    this.doc.moveDown(0);
  }

  /**
   * Adds a code block to the PDF
   * @private
   * @param {Object} element - Code element
   */
  addCode(element) {
    const style = styles.text.code;

    // Add code text first without background
    this.doc
      .font(this.fonts.code.regular)
      .fontSize(style.fontSize)
      .fillColor(styles.colors.code);

    // Calculate exact dimensions
    const padding = 8;
    const codeWidth = this.doc.page.width
      - this.doc.page.margins.left
      - this.doc.page.margins.right
      - (padding * 2);

    // Get exact height of text
    const textHeight = this.doc.heightOfString(element.content, {
      width: codeWidth,
      lineGap: style.fontSize * 0.3
    });

    // Draw background just before text
    this.doc
      .save()
      .roundedRect(
        this.doc.page.margins.left,
        this.currentY - 15,
        this.doc.page.width - this.doc.page.margins.left - this.doc.page.margins.right,
        textHeight + (padding * 2),
        4
      )
      .fill('#f6f8fa')
      .restore();

    // Add the text over background
    this.doc.text(element.content,
      this.doc.page.margins.left + padding,
      this.currentY,
      {
        width: codeWidth,
        lineGap: style.fontSize * 0.3
      }
    );

    // Update position - only the actual height plus small margin
    this.currentY += textHeight + style.spacing;
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