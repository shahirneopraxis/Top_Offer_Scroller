# Netlify Deployment Guide

## Quick Deploy to Netlify

### Method 1: GitHub + Netlify (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Deploy on Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and select your repository
   - Build settings (auto-detected from netlify.toml):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Your CDN URL:**
```
https://your-site-name.netlify.app/offer-scroller.min.js
```

### Method 2: Netlify CLI (Fast)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy
netlify deploy --prod

# Follow prompts:
# - Create & configure new site: Yes
# - Publish directory: dist
```

Your CDN URL will be displayed after deployment.

### Method 3: Drag & Drop

1. Build locally:
```bash
npm run build
```

2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder onto the page
4. Get your CDN URL instantly

---

## Using Your CDN

After deployment, use it in your HTML:

```html
<!-- Replace YOUR-SITE-NAME with your actual Netlify subdomain -->
<script async src="https://YOUR-SITE-NAME.netlify.app/offer-scroller.min.js"></script>

<offer-scroller
  data-items='[
    {"text":"Free shipping over $50","link":"/sale"},
    {"text":"20% off with code SAVE20","link":"/discounts"}
  ]'
  data-bg="#0b76ff"
  data-color="#ffffff"
  data-closeable="true"
></offer-scroller>
```

---

## Custom Domain (Optional)

### Add Custom Domain:

1. In Netlify dashboard → Domain settings
2. Add custom domain: `cdn.yourdomain.com`
3. Add DNS records (provided by Netlify)
4. Use your custom URL:

```html
<script async src="https://cdn.yourdomain.com/offer-scroller.min.js"></script>
```

---

## Automatic Deployments

With GitHub integration, Netlify auto-deploys on every push:

```bash
# Make changes
npm run build

# Commit and push
git add .
git commit -m "Update widget"
git push

# Netlify automatically rebuilds and deploys
```

---

## CDN Features Enabled

✅ **CORS Headers** - Works on any domain
✅ **Cache Control** - 1 year cache (immutable)
✅ **Global CDN** - Fast worldwide delivery
✅ **HTTPS** - Secure by default
✅ **Gzip/Brotli** - Automatic compression

---

## Verify Deployment

Test your CDN URL:

```bash
# Check if file is accessible
curl -I https://YOUR-SITE-NAME.netlify.app/offer-scroller.min.js

# Should return:
# HTTP/2 200
# content-type: application/javascript
# cache-control: public, max-age=31536000, immutable
# access-control-allow-origin: *
```

---

## File Sizes

After deployment, your CDN will serve:
- `offer-scroller.min.js` (~8.5KB minified, ~3KB gzipped)
- `offer-scroller.min.js.map` (source map for debugging)

---

## Troubleshooting

### Build fails on Netlify?
- Check Node.js version in Netlify settings (use 18+)
- Verify `package.json` has all dependencies
- Check build logs for errors

### CORS errors?
- Verify `netlify.toml` has CORS headers
- Clear browser cache
- Check Network tab for actual headers

### File not found (404)?
- Ensure `dist` folder is published
- Check build logs to confirm files were created
- Verify URL path is correct

---

## Production Checklist

Before going live:

- [ ] Build succeeds locally (`npm run build`)
- [ ] Test widget on demo.html
- [ ] Push to GitHub
- [ ] Deploy to Netlify
- [ ] Test CDN URL in browser
- [ ] Verify CORS headers
- [ ] Test on your actual website
- [ ] Monitor Netlify analytics

---

## Cost

**Free tier includes:**
- 100GB bandwidth/month
- Unlimited sites
- HTTPS
- Global CDN
- Automatic deployments

Perfect for most use cases!
