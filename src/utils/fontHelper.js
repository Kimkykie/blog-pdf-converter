// src/utils/fontHelper.js
import fs from 'fs';
import path from 'path';
import { FONTS } from '../config/fonts.js';

export function loadFonts(doc) {
  const loadedFonts = {};

  // Load main fonts
  loadedFonts.main = {};
  Object.entries(FONTS.main).forEach(([style, font]) => {
    try {
      const fontPath = path.resolve(process.cwd(), font.path);
      if (fs.existsSync(fontPath)) {
        doc.registerFont(font.name, fontPath);
        loadedFonts.main[style] = font.name;
      } else {
        loadedFonts.main[style] = font.fallback;
        console.log(`Using fallback for main ${style} font`);
      }
    } catch (error) {
      loadedFonts.main[style] = font.fallback;
      console.log(`Error loading main ${style} font, using fallback`);
    }
  });

  // Load code fonts
  loadedFonts.code = {};
  Object.entries(FONTS.code).forEach(([style, font]) => {
    try {
      const fontPath = path.resolve(process.cwd(), font.path);
      if (fs.existsSync(fontPath)) {
        doc.registerFont(font.name, fontPath);
        loadedFonts.code[style] = font.name;
      } else {
        loadedFonts.code[style] = font.fallback;
        console.log(`Using fallback for code ${style} font`);
      }
    } catch (error) {
      loadedFonts.code[style] = font.fallback;
      console.log(`Error loading code ${style} font, using fallback`);
    }
  });

  return loadedFonts;
}