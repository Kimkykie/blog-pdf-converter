// src/config/fonts.js
/**
 * @fileoverview Font configuration with styles
 */

export const FONTS = {
  main: {
    regular: {
      path: 'fonts/open_sans/OpenSans-Regular.ttf',
      name: 'OpenSans',
      fallback: 'Helvetica'
    },
    bold: {
      path: 'fonts/open_sans/OpenSans-Bold.ttf',
      name: 'OpenSans-Bold',
      fallback: 'Helvetica-Bold'
    },
    italic: {
      path: 'fonts/open_sans/OpenSans-Italic.ttf',
      name: 'OpenSans-Italic',
      fallback: 'Helvetica-Oblique'
    }
  },
  code: {
    regular: {
      path: 'fonts/fira/FiraCode-Regular.ttf',
      name: 'FiraCode',
      fallback: 'Courier'
    },
    medium: {
      path: 'fonts/fira/FiraCode-Medium.ttf',
      name: 'FiraCode-Medium',
      fallback: 'Courier-Bold'
    }
  }
};