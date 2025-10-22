# Top Offer Scroller

A lightweight, dependency-free, embeddable Top Offer Scroller built as a Web Component (Custom Element + Shadow DOM). Delivered as a single minified JS file (~8.5KB) for easy CDN deployment.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Size](https://img.shields.io/badge/Size-8.5KB-green.svg)](dist/offer-scroller.min.js)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](CHANGELOG.md)

## ✨ Features

- 🪶 **Lightweight**: Under 12KB gzipped, zero runtime dependencies
- 🔒 **Isolated**: Shadow DOM prevents CSS/JS conflicts with your site
- ♿ **Accessible**: ARIA labels, keyboard navigation, reduced-motion support
- 📱 **Responsive**: Mobile-friendly with proper tap targets
- 🎨 **Customizable**: Easy theming via attributes and CSS custom properties
- ⚡ **Performant**: CSS-based animation with GPU acceleration
- 🔧 **Easy Integration**: Single script tag + HTML element
- 📊 **Analytics Ready**: Custom events for tracking user interactions

## 🚀 Quick Start

### Installation

Add the script to your HTML:

```html
<!-- Load the widget -->
<script async src="https://cdn.example.com/offer-scroller.min.js"></script>

<!-- Add to your page -->
<offer-scroller
  data-items='[
    {"text":"Free shipping over $50","link":"/collections/sale"},
    {"text":"20% off — code: SAVE20","link":"/discounts"}
  ]'
  data-speed="12"
  data-bg="#111"
  data-color="#fff"
  data-closeable="true"
></offer-scroller>
```

That's it! The scroller will appear at the top of your page.

## 📖 Configuration

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-items` | JSON Array | Default message | Array of offer objects (see below) |
| `data-speed` | Number | `12` | Scroll speed in pixels per second |
| `data-placement` | String | `"top"` | Position: `"top"` or `"bottom"` |
| `data-bg` | CSS Color | `"#111"` | Background color (supports gradients) |
| `data-color` | CSS Color | `"#fff"` | Text color |
| `data-closeable` | Boolean | `false` | Show close button (`"true"` or `"false"`) |
| `data-persist` | String | `"local"` | Storage mode: `"local"` or `"session"` |
| `data-aria-label` | String | `"Promotional offers"` | Accessibility label |
| `data-class` | String | `""` | Custom class for additional styling hooks |
| `data-font-family` | String | System fonts | Font family (any CSS font-family value) |
| `data-font-size` | String | `"14px"` | Font size (any CSS size unit) |
| `data-font-weight` | String | `"500"` | Font weight (100-900 or keywords) |
| `data-font-style` | String | `"normal"` | Font style (normal, italic, oblique) |
| `data-letter-spacing` | String | `"0.02em"` | Letter spacing (any CSS length) |
| `data-text-transform` | String | `"none"` | Text transform (uppercase, lowercase, capitalize, none) |
| `data-text-decoration` | String | `"none"` | Text decoration (underline, overline, line-through, none) |
| `data-animation` | String | `"scroll"` | Animation mode: `"scroll"`, `"slide"`, or `"fade"` |
| `data-slide-duration` | Number | `3000` | Duration in milliseconds for slide/fade animations |
| `data-pause-on-hover` | Boolean | `true` | Pause animation on hover (`"true"` or `"false"`) |
| `data-show-link-underline` | Boolean | `false` | Show underline on link hover (`"true"` or `"false"`) |
| `data-show-hover-border` | Boolean | `true` | Show border/outline on link hover (`"true"` or `"false"`) |
| `data-always-show-underline` | Boolean | `false` | Always show underline on links (`"true"` or `"false"`) |

### Item Object Format

Each item in the `data-items` array should follow this structure:

```javascript
{
  "text": "Your offer text",      // Required: The message to display
  "link": "/your-link",           // Optional: URL to link to
  "target": "_self",              // Optional: "_self" or "_blank"
  "html": false                   // Optional: Allow HTML in text (default: false)
}
```

**Inline HTML Links**: To add a link within text, use the `html` property:

```javascript
{
  "text": "New arrivals! <a href=\"/new\" style=\"text-decoration:underline;color:inherit;\">click here</a>",
  "html": true
}
```

## 💡 Examples

### Basic Usage (Top Placement)

```html
<offer-scroller
  data-items='[
    {"text":"Free shipping over $50","link":"/collections/sale"},
    {"text":"20% off — code: SAVE20","link":"/discounts"}
  ]'
  data-speed="14"
  data-bg="#0b76ff"
  data-color="#ffffff"
  data-closeable="true"
></offer-scroller>
```

### Bottom Placement

```html
<offer-scroller
  data-items='[
    {"text":"Visit our new store location","link":"/locations"},
    {"text":"Subscribe to our newsletter","link":"/newsletter"}
  ]'
  data-placement="bottom"
  data-bg="#2d3748"
  data-color="#f7fafc"
></offer-scroller>
```

### Gradient Background

```html
<offer-scroller
  data-items='[
    {"text":"Summer Sale Now Live","link":"/summer"}
  ]'
  data-bg="linear-gradient(90deg, #f093fb 0%, #f5576c 100%)"
  data-color="#ffffff"
></offer-scroller>
```

### Multiple Items with External Links

```html
<offer-scroller
  data-items='[
    {"text":"Follow us on Twitter","link":"https://twitter.com/yourstore","target":"_blank"},
    {"text":"Join our Discord","link":"https://discord.gg/yourserver","target":"_blank"},
    {"text":"Read our blog","link":"https://blog.yourstore.com","target":"_blank"}
  ]'
  data-speed="10"
></offer-scroller>
```

### Slow Speed for Important Messages

```html
<offer-scroller
  data-items='[
    {"text":"Important: Store hours updated for holidays","link":"/hours"}
  ]'
  data-speed="5"
  data-bg="#48bb78"
  data-color="#ffffff"
></offer-scroller>
```

### Custom Typography

```html
<offer-scroller
  data-items='[
    {"text":"Exclusive Collection","link":"/luxury"}
  ]'
  data-font-family="Georgia, serif"
  data-font-size="16px"
  data-font-weight="700"
  data-font-style="italic"
  data-letter-spacing="0.1em"
  data-text-transform="uppercase"
  data-bg="#000000"
  data-color="#d4af37"
></offer-scroller>
```

### Slide Animation (One by One)

```html
<offer-scroller
  data-items='[
    {"text":"Flash Sale: 50% OFF","link":"/sale"},
    {"text":"Limited Time Only","link":"/sale"}
  ]'
  data-animation="slide"
  data-slide-duration="3000"
  data-bg="#f56565"
  data-color="#ffffff"
></offer-scroller>
```

### Fade Animation (Elegant)

```html
<offer-scroller
  data-items='[
    {"text":"Exclusive Collection","link":"/luxury"},
    {"text":"Limited Edition","link":"/limited"}
  ]'
  data-animation="fade"
  data-slide-duration="4000"
  data-bg="#1a202c"
  data-color="#d4af37"
></offer-scroller>
```

## 🎬 Animation Modes

The widget supports 3 animation modes:

### 1. Scroll (Default)
Continuous horizontal scrolling - traditional ticker style.
- Best for: 4+ items, continuous visibility
- Speed controlled by `data-speed` (pixels/second)

### 2. Slide
Shows one offer at a time with smooth transitions.
- Best for: 2-5 important announcements
- Timing controlled by `data-slide-duration` (milliseconds)
- Centered display

### 3. Fade
Elegant fade in/out effect.
- Best for: Luxury brands, 2-4 items
- Timing controlled by `data-slide-duration` (milliseconds)
- Premium, sophisticated feel

**Recommended Timings:**
- Fast: 1000-2000ms (urgent messages)
- Normal: 3000-4000ms (standard announcements)
- Slow: 5000-7000ms (longer messages)

## 🎨 Typography Customization

Control every aspect of text styling:

```html
<offer-scroller
  data-items='[{"text":"Luxury Brand","link":"/luxury"}]'
  data-font-family="'Playfair Display', Georgia, serif"
  data-font-size="18px"
  data-font-weight="700"
  data-font-style="italic"
  data-letter-spacing="0.1em"
  data-text-transform="uppercase"
  data-bg="#000000"
  data-color="#d4af37"
></offer-scroller>
```

**Popular Font Combinations:**
- **Modern**: `'Inter', -apple-system, sans-serif`
- **Elegant**: `'Playfair Display', Georgia, serif`
- **Clean**: `'Helvetica Neue', Arial, sans-serif`
- **Bold**: `'Montserrat', sans-serif`

## 🖱️ Hover Controls

Fine-tune hover behavior with 4 attributes:

```html
<offer-scroller
  data-items='[...]'
  data-pause-on-hover="false"           <!-- Keep animating on hover -->
  data-show-link-underline="true"       <!-- Underline links on hover -->
  data-show-hover-border="false"        <!-- Hide border on hover -->
  data-always-show-underline="true"     <!-- Always show underlines -->
></offer-scroller>
```

**Common Combinations:**
- **Minimal**: `data-show-hover-border="false"` + `data-always-show-underline="true"`
- **Traditional**: `data-show-link-underline="true"` + `data-show-hover-border="true"`
- **Continuous**: `data-pause-on-hover="false"` (keeps scrolling)

## 🔧 JavaScript API

Control the scroller programmatically:

```javascript
const scroller = document.querySelector('offer-scroller');

// Close the scroller
scroller.close();

// Show the scroller (clears close state)
scroller.show();

// Update items dynamically
scroller.updateItems([
  { text: 'New flash sale!', link: '/flash-sale' },
  { text: 'Limited time only', link: '/limited' }
]);
```

## 📡 Events

Listen to custom events for analytics integration:

```javascript
const scroller = document.querySelector('offer-scroller');

// Fired when scroller is opened/rendered
scroller.addEventListener('offer-scroller:open', (event) => {
  console.log('Scroller opened', event.detail.config);
  // Send to analytics
});

// Fired when user closes the scroller
scroller.addEventListener('offer-scroller:close', (event) => {
  console.log('Scroller closed', event.detail);
  // event.detail: { timestamp, persist }
});

// Fired when scroller is hidden due to previous close
scroller.addEventListener('offer-scroller:hidden', (event) => {
  console.log('Scroller hidden', event.detail.reason);
});

// Fired when scroller is shown programmatically
scroller.addEventListener('offer-scroller:show', (event) => {
  console.log('Scroller shown', event.detail.timestamp);
});
```

## 🎨 Advanced Theming

Use CSS custom properties for advanced theming:

```html
<style>
  offer-scroller {
    --scroller-bg: #1a202c;
    --scroller-color: #f7fafc;
    --scroller-padding: 16px 0;
    --scroller-font-size: 16px;
    --scroller-link-gap: 64px;
    --scroller-z-index: 10000;
  }
</style>

<offer-scroller
  data-items='[{"text":"Custom styled offer","link":"#"}]'
></offer-scroller>
```

### Available CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--scroller-bg` | `#111` | Background color |
| `--scroller-color` | `#fff` | Text color |
| `--scroller-padding` | `12px 0` | Vertical padding |
| `--scroller-font-size` | `14px` | Font size |
| `--scroller-font-family` | System fonts | Font family |
| `--scroller-link-gap` | `48px` | Space between items |
| `--scroller-close-size` | `24px` | Close button size |
| `--scroller-z-index` | `9999` | Stacking order |

## ♿ Accessibility

The scroller is built with accessibility in mind:

- ✅ **Keyboard Navigation**: Tab through links and close button
- ✅ **ARIA Labels**: Proper roles and labels for screen readers
- ✅ **Reduced Motion**: Respects `prefers-reduced-motion` media query
- ✅ **Focus Management**: Animation pauses when focused
- ✅ **Tap Targets**: Minimum 44px touch targets for mobile
- ✅ **High Contrast**: Support for high contrast mode
- ✅ **Semantic HTML**: Proper link relationships and attributes

### Testing Accessibility

```javascript
// Test keyboard navigation
// 1. Press Tab to focus on links
// 2. Press Enter to follow link
// 3. Press Tab to reach close button
// 4. Press Enter to close

// Test reduced motion
// Enable "Reduce motion" in OS settings
// Animation should stop
```

## 🌐 Browser Support

Works in all modern browsers with Custom Elements and Shadow DOM support:

- ✅ Chrome/Edge 67+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Opera 54+

**Note**: IE11 is not supported (requires polyfills for Custom Elements and Shadow DOM).

## 🔨 Development

### Prerequisites

- Node.js 14+ and npm

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Serve demo locally
npm run serve
```

### Project Structure

```
offer-scroller/
├── src/
│   ├── scroller.js      # Main Custom Element source
│   └── scroller.css     # Shadow DOM styles
├── dist/
│   ├── offer-scroller.min.js    # Minified bundle
│   └── offer-scroller.min.js.map
├── demo.html            # Integration demo
├── rollup.config.js     # Build configuration
├── package.json
├── CHANGELOG.md
└── README.md
```

### Building

The build process uses Rollup to:
1. Bundle the JavaScript and CSS into a single file
2. Inline CSS as a string in the JS
3. Minify and optimize the output
4. Generate source maps

Output: `dist/offer-scroller.min.js` (under 12KB gzipped)

## 📦 CDN Deployment

### Quick Deploy to Netlify (Recommended)

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Step 2: Deploy on Netlify**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

**Step 3: Get Your CDN URL**
```
https://your-site-name.netlify.app/offer-scroller.min.js
```

**Use in your HTML:**
```html
<script async src="https://your-site-name.netlify.app/offer-scroller.min.js"></script>

<offer-scroller
  data-items='[{"text":"Free shipping","link":"/sale"}]'
  data-bg="#0b76ff"
  data-color="#fff"
></offer-scroller>
```

### Alternative: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod
```

### Other CDN Options

**jsDelivr (GitHub):**
```html
<script async src="https://cdn.jsdelivr.net/gh/username/repo@version/dist/offer-scroller.min.js"></script>
```

**AWS S3 + CloudFront:**
```bash
npm run build
aws s3 cp dist/offer-scroller.min.js s3://bucket/offer-scroller.min.js --cache-control max-age=31536000
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔍 Troubleshooting

### Scroller not appearing?

1. **Check browser console** for errors
2. **Verify script loaded**: `console.log(window.OfferScrollerWidgetVersion)`
3. **Validate JSON**: Ensure `data-items` is valid JSON
4. **Check close state**: Clear localStorage if previously closed
   ```javascript
   localStorage.removeItem('offer-scroller-closed');
   ```

### Invalid data-items?

```javascript
// ❌ Invalid - missing quotes
data-items='[{text:Invalid}]'

// ✅ Valid - proper JSON
data-items='[{"text":"Valid"}]'

// ✅ Valid - with link
data-items='[{"text":"Valid","link":"/link"}]'
```

### Styling conflicts?

Shadow DOM isolates styles, but check for:
- **Z-index conflicts**: Adjust `--scroller-z-index`
- **Position conflicts**: Ensure parent elements don't have conflicting positioning
- **Custom properties**: Use `data-class` for additional styling hooks

### Animation not smooth?

1. **Reduce speed**: Lower `data-speed` value
2. **Check performance**: Browser performance issues may affect animation
3. **Reduced motion**: Animation pauses with `prefers-reduced-motion`
4. **Hover/focus**: Animation pauses on hover and focus (by design)

### Close button not working?

1. **Check closeable attribute**: Must be `data-closeable="true"` (string)
2. **Check storage**: Ensure localStorage/sessionStorage is available
3. **Clear storage**: Test with cleared storage
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

## 📊 Performance

- **Bundle size**: ~8-10KB minified, <12KB gzipped
- **Runtime overhead**: Minimal (Custom Elements API)
- **Animation**: CSS-based, GPU-accelerated
- **Memory**: Low footprint, no memory leaks
- **Load time**: Async loading, non-blocking

### Performance Tips

1. **Use `async` attribute** on script tag
2. **Enable CDN caching** with long max-age
3. **Optimize item count** (5-10 items recommended)
4. **Use appropriate speed** (10-15 px/s is optimal)

## 🧪 QA Checklist

- [x] Shadow DOM encapsulation working
- [x] No global CSS leakage
- [x] Attributes parsed safely (try/catch)
- [x] Events dispatched correctly
- [x] ARIA attributes present
- [x] Works with async script tag
- [x] Top and bottom placements work
- [x] Close button persists state (24h)
- [x] Session storage mode works
- [x] Keyboard navigation functional
- [x] Reduced motion respected
- [x] Mobile responsive
- [x] High contrast mode support
- [x] No console errors with invalid data
- [x] Graceful fallback for missing attributes

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 📄 License

MIT License - feel free to use in commercial and personal projects.

## 💬 Support

### Need Help?

- 📖 Check the [demo page](demo.html) for live examples
- 🐛 Report issues on GitHub
- 💡 Feature requests welcome

### Custom Development

**Need a custom variant or theme-styled version?** Reach out to our team — we'll convert and style it for you.

- Custom themes and branding
- Integration with your CMS/platform
- Advanced features and functionality
- Priority support and maintenance

---

**Made with ❤️ for the web community**

Version: 1.0.0 | [View Demo](demo.html) | [GitHub](https://github.com/yourrepo/offer-scroller)
