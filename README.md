# blog-pdf-converter

Convert web articles and blog posts to clean, readable PDFs. Built with Node.js, Puppeteer, and PDFKit.

## Purpose
A minimalist Node.js tool that converts web articles and blog posts to clean, readable PDFs. Strips away distractions and preserves the essential content in a format optimized for reading, sharing, and archiving.

## Why blog-pdf-converter?
- Archive important articles offline
- Create clean, readable documents from cluttered web pages
- Build personal knowledge bases
- Share content in a consistent format
- Optimize content for LLM processing (clean text = better analysis)
- Read comfortably on e-readers

## Features
- Clean content extraction from webpages
- Preserves document structure (headings, paragraphs)
- Code block formatting with syntax highlighting
- Quotation block support
- Configurable margins and spacing
- Automatic page breaks
- Custom styling options

## Installation
```bash
git clone https://github.com/Kimkykie/blog-pdf-converter.git
cd blog-pdf-converter
npm install
```

## Usage

```bash
npm start
# Enter URL when prompted
```

## Roadmap
- [ ] Customizable headers and footers
- [ ] Table of contents generation
- [ ] Render lists
- [ ] Link preservation
- [ ] Image support
- [x] Custom font integration
- [ ] Chrome Extension support
  - [ ] Right-click to convert
  - [ ] Custom shortcuts
  - [ ] Save to preferred location
  - [ ] Quick share options

## Tech Stack
- Node.js
- Puppeteer (web scraping)
- PDFKit (PDF generation)
- Mozilla Readbility (Readability library used for Firefox Reader View)
