# blog-pdf-converter

Convert web articles to clean, readable PDFs. Strip ads and clutter, preserve content structure.

## Problem

Web articles are cluttered with ads, popups, and distracting elements. Archiving or sharing clean versions requires manual cleanup or expensive tools.

## Solution

Automated content extraction using Mozilla's Readability algorithm (same engine as Firefox Reader View) combined with custom PDF generation. Input a URL, get a clean PDF optimized for reading.

## Usage

```bash
git clone https://github.com/Kimkykie/blog-pdf-converter.git
cd blog-pdf-converter
npm install
npm start
```

Enter URL when prompted. PDF saves to local directory.

## What it extracts

- Article text and structure
- Headings and paragraphs  
- Code blocks with syntax highlighting
- Quotation blocks
- Configurable styling and margins

## Tech Stack

- **Puppeteer** - Headless Chrome automation
- **Mozilla Readability** - Content extraction (Firefox Reader View engine)
- **PDFKit** - PDF generation with custom formatting

## Use Cases

- Archive articles offline
- Clean up content for LLM processing
- Create consistent document formats
- Remove distractions for focused reading

## Roadmap

- [ ] Image support
- [ ] Table/list rendering
- [ ] Chrome extension (right-click conversion)
- [ ] Bulk URL processing
- [ ] Custom styling templates

## Contributing

Focus areas:
- Content extraction accuracy
- PDF formatting improvements  
- Performance optimization for large articles

## License

MIT

---

**Note**: This was a learning project for Puppeteer scraping techniques. Production use may require additional error handling and rate limiting.
