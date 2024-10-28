// src/extractors/contentExtractor.js
import { launch } from 'puppeteer';
import logger from '../utils/logger.js';

async function extractContent(url) {
  const browser = await launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pageData = await page.evaluate(() => {
      const elements = [];
      const title = document.title;

      // Select all headings and paragraphs
      const nodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, pre, blockquote');

      nodes.forEach((node, index) => {
        const tagName = node.tagName.toLowerCase();

        if (tagName.match(/h[1-6]/)) {
          elements.push({
            type: 'heading',
            level: parseInt(tagName[1]),
            content: node.textContent.trim(),
            id: `heading-${index}`
          });
        } else if (tagName === 'p') {
          const text = node.textContent.trim();
          if (text) {
            elements.push({
              type: 'paragraph',
              content: text
            });
          }
        } else if (tagName === 'pre') {
          elements.push({
            type: 'code',
            content: node.textContent.trim()
          });
        } else if (tagName === 'blockquote') {
          elements.push({
            type: 'quote',
            content: node.textContent.trim()
          });
        }
      });

      return { title, elements };
    });

    return pageData;

  } catch (error) {
    logger.error('Content extraction failed', { url, error });
    throw error;
  } finally {
    await browser.close();
  }
}

export default extractContent;