// src/extractors/elementExtractors.js
/**
 * @fileoverview Element extraction handlers for different HTML elements
 * @module elementExtractors
 */

/**
 * @typedef {Object} ExtractedElement
 * @property {string} type - Type of element
 * @property {string} content - Element content
 * @property {number} [level] - Heading level (for headings)
 * @property {string} [id] - Element identifier
 */

const elementExtractors = {
  /**
   * Extracts heading content
   * @param {HTMLElement} node - Heading element
   * @returns {ExtractedElement} Extracted heading data
   */
  heading: (node) => ({
    type: 'heading',
    level: parseInt(node.tagName[1]),
    content: node.textContent.trim(),
    id: `heading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }),

  /**
   * Extracts paragraph content
   * @param {HTMLElement} node - Paragraph element
   * @returns {ExtractedElement} Extracted paragraph data
   */
  paragraph: (node) => ({
    type: 'paragraph',
    content: node.textContent.trim()
  }),

  /**
   * Extracts blockquote content
   * @param {HTMLElement} node - Blockquote element
   * @returns {ExtractedElement} Extracted quote data
   */
  blockquote: (node) => ({
    type: 'quote',
    content: node.textContent.trim()
  }),

  /**
   * Extracts code block content
   * @param {HTMLElement} node - Code element
   * @returns {ExtractedElement} Extracted code data
   */
  code: (node) => ({
    type: 'code',
    content: node.textContent.trim(),
    language: node.className.replace('language-', '')
  })
};

export default elementExtractors;