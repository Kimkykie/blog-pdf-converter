// src/config/pdfStyles.js
/**
 * @fileoverview PDF styling configuration
 * @module pdfStyles
 */

/**
 * @typedef {Object} PDFStyles
 * @property {Object} fonts - Font configurations
 * @property {Object} colors - Color schemes
 * @property {Object} heading - Heading styles
 * @property {Object} text - Text styles
 */
const styles = {
  fonts: {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    italic: 'Helvetica-Oblique',
    code: 'Courier'
  },
  // You can try any of these built-in fonts in PDFKit:
  // 'Courier', 'Helvetica', 'Times-Roman'
  // or their variants like 'Times-Bold', 'Times-Italic'

  colors: {
    heading: '#2C3E50',
    text: '#333333',
    link: '#3498DB',
    quote: '#7F8C8D',
    code: '#E74C3C'
  },
  heading: {
    1: { fontSize: 20, spacing: 16, color: '#2C3E50' },
    2: { fontSize: 16, spacing: 12, color: '#2C3E50' },
    3: { fontSize: 14, spacing: 10, color: '#2C3E50' },
    4: { fontSize: 12, spacing: 8, color: '#2C3E50' },
    5: { fontSize: 11, spacing: 8, color: '#2C3E50' },
    6: { fontSize: 10, spacing: 8, color: '#2C3E50' }
  },
  text: {
    paragraph: {
      fontSize: 10,
      spacing: 12,    // Increased spacing between paragraphs
      lineHeight: 1.4 // Added line height for better readability
    },
    quote: {
      fontSize: 10,
      spacing: 12,
      indent: 30
    },
    code: {
      fontSize: 9,
      spacing: 12
    }
  },
  page: {
    margin: {
      top: 72,
      bottom: 72,
      left: 72,
      right: 72
    },
    padding: 36
  }
};

export default styles;