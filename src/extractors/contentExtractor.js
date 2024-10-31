// src/extractors/contentExtractor.js
import { launch } from 'puppeteer';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import logger from '../utils/logger.js';

/**
 * Extracts structured content from webpage
 * @async
 * @param {string} url - URL to extract content from
 * @returns {Promise<ExtractedContent>} Extracted content
 * @throws {Error} If extraction fails
 */
async function extractContent(url) {
  const browser = await launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  try {
    const page = await browser.newPage();
    await setupPageInterception(page);
    await page.setJavaScriptEnabled(false);

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    if (!response.ok()) {
      throw new Error(`Failed to load page: ${response.status()}`);
    }

    // Get HTML and parse with Readability
    const html = await page.content();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document, {
      charThreshold: 100,
      classesToPreserve: ['article-heading', 'post-title', 'entry-title'],
      keepClasses: true
    });

    const article = reader.parse();

    if (!article) {
      logger.warn('Readability parsing failed, falling back to direct extraction');
      return await extractContentDirect(page);
    }

    // Extract structured content while maintaining order
    const elements = await page.evaluate((articleHTML) => {
      const container = document.createElement('div');
      container.innerHTML = articleHTML;

      const elements = [];

      // Process all elements in document order
      const nodes = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, pre, blockquote');
      nodes.forEach((node, index) => {
        const tagName = node.tagName.toLowerCase();
        const content = node.textContent.trim();

        if (!content) return;

        // Process each element type while maintaining order
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
          const codeElement = node.querySelector('code');
          elements.push({
            type: 'code',
            content: (codeElement || node).textContent.trim(),
            language: codeElement?.className?.split(' ')
              .find(cls => cls.startsWith('language-') || cls.startsWith('lang-'))
              ?.split('-')[1] || null
          });
        } else if (tagName === 'blockquote') {
          elements.push({
            type: 'quote',
            content,
            citation: node.getAttribute('cite')
          });
        }
      });

      return elements;
    }, article.content);

    // Check if we need to merge with original content
    const readabilityHeadings = elements.filter(el => el.type === 'heading').length;

    if (readabilityHeadings === 0) {
      // If Readability stripped all headings, use direct extraction
      logger.info('No headings found in Readability output, falling back to direct extraction');
      return await extractContentDirect(page);
    }

    return {
      title: article.title,
      elements: elements,
      metadata: {
        author: article.byline || null,
        siteName: article.siteName || null,
        excerpt: article.excerpt || null
      }
    };

  } catch (error) {
    logger.error('Content extraction failed', { url, error });
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Direct content extraction fallback
 * @private
 */
async function extractContentDirect(page) {
  logger.info('Starting direct content extraction');

  return page.evaluate(() => {
    const elements = [];
    const mainContent = document.querySelector('article') ||
      document.querySelector('main') ||
      document.querySelector('.article-content') ||
      document.querySelector('.post-content') ||
      document.body;

    // Process all elements in their natural order
    const nodes = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, pre, blockquote');
    nodes.forEach((node, index) => {
      const tagName = node.tagName.toLowerCase();
      const content = node.textContent.trim();

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
        const codeElement = node.querySelector('code');
        elements.push({
          type: 'code',
          content: (codeElement || node).textContent.trim(),
          language: codeElement?.className?.split(' ')
            .find(cls => cls.startsWith('language-') || cls.startsWith('lang-'))
            ?.split('-')[1] || null
        });
      } else if (tagName === 'blockquote') {
        elements.push({
          type: 'quote',
          content,
          citation: node.getAttribute('cite')
        });
      }
    });

    return {
      title: document.title,
      elements,
      metadata: {
        author: document.querySelector('meta[name="author"]')?.content ||
          document.querySelector('.author')?.textContent?.trim(),
        siteName: document.querySelector('meta[property="og:site_name"]')?.content,
        excerpt: document.querySelector('meta[name="description"]')?.content
      }
    };
  });
}

async function setupPageInterception(page) {
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font', 'script', 'media'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

export default extractContent;