/**
 * Rollup configuration for Top Offer Scroller
 * Bundles CSS and JS into a single minified file
 */

import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/scroller.js',
  output: {
    file: 'dist/offer-scroller.min.js',
    format: 'iife',
    name: 'OfferScroller',
    sourcemap: true,
    banner: '/*! Top Offer Scroller v1.0.0 | MIT License | https://github.com/yourrepo/offer-scroller */',
  },
  plugins: [
    // Process CSS and inline it as a string
    postcss({
      inject: false,
      extract: false,
      minimize: true,
      modules: false,
      extensions: ['.css'],
    }),
    // Minify the output
    terser({
      compress: {
        passes: 2,
        pure_getters: true,
        unsafe: true,
      },
      mangle: {
        properties: false,
      },
      format: {
        comments: /^!/,
      },
    }),
  ],
};
