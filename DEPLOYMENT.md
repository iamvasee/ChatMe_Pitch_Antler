# Deployment Guide - ChatMe Pitch Deck

## 🚀 Shared Hosting Deployment

### Step 1: Prepare Files
All web-accessible files are in the `public/` folder:
- `index.html` - Main landing page
- `styles.css` - Complete styling
- `script.js` - Interactive functionality
- `config.js` - Questions and answers
- `.htaccess` - Server configuration
- Image and audio files

### Step 2: Upload to Server
1. **Connect to your hosting provider** (cPanel, FTP, etc.)
2. **Navigate to public_html** (or your web root directory)
3. **Upload all files** from the `public/` folder to your web root
4. **Ensure .htaccess is uploaded** (it may be hidden by default)

### Step 3: Configure Server
The `.htaccess` file includes:
- URL rewriting for single-page application
- Security headers
- Cache control for optimal performance
- Compression for faster loading
- CORS headers for API requests

### Step 4: Test Your Site
1. Visit your domain: `https://yourdomain.com`
2. The interactive pitch deck should load immediately
3. Test the chat functionality
4. Verify all images and sounds load properly

## 🔧 Common Issues & Solutions

### Issue: Files not loading
**Solution**: Ensure all files are in the web root directory, not in subfolders

### Issue: .htaccess not working
**Solution**: 
- Check if mod_rewrite is enabled on your server
- Contact your hosting provider to enable it
- Some shared hosts require specific configuration

### Issue: Audio not playing
**Solution**: 
- Ensure `.mp3` files are uploaded
- Check browser autoplay policies
- Test on different browsers

### Issue: Images not displaying
**Solution**:
- Verify image files are uploaded
- Check file permissions (644 for files, 755 for directories)
- Ensure correct file paths in HTML

## 📱 Mobile Optimization
The site is already optimized for mobile devices with:
- Responsive design
- Touch-friendly interface
- Optimized loading times
- Mobile-first CSS

## 🔒 Security Features
The `.htaccess` file includes:
- XSS protection headers
- Content type sniffing prevention
- Frame options for clickjacking protection
- Secure referrer policy

## 📊 Performance Optimization
- Static assets cached for 1 year
- HTML files set to no-cache for fresh content
- Gzip compression enabled
- Optimized images and audio files

## 🌐 Browser Compatibility
Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📞 Support
If you encounter issues:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Test on different browsers
4. Contact your hosting provider for server configuration

---

*Ready for investor presentations! 🚀* 