// src/extractors/contentExtractor.js
import { launch } from 'puppeteer';
import logger from '../utils/logger.js';

async function extractContent(url) {
  const browser = await launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  try {
    const page = await browser.newPage();

    // Disable unnecessary resource loading
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font', 'script', 'media'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Only load document content
    await page.setJavaScriptEnabled(false);

    // Navigate with minimal wait
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const pageData = await page.evaluate(() => {
      const elements = [];
      const title = document.title;

      // Select all relevant elements
      const nodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, pre, blockquote');

      nodes.forEach((node, index) => {
        const tagName = node.tagName.toLowerCase();
        const content = node.textContent.trim();

        // Skip empty nodes
        if (!content) return;

        if (tagName.match(/h[1-6]/)) {
          elements.push({
            type: 'heading',
            level: parseInt(tagName[1]),
            content,
            id: `heading-${index}`
          });
        } else if (tagName === 'p') {
          elements.push({
            type: 'paragraph',
            content
          });
        } else if (tagName === 'pre') {
          elements.push({
            type: 'code',
            content
          });
        } else if (tagName === 'blockquote') {
          elements.push({
            type: 'quote',
            content
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