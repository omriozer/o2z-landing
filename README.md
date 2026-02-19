# O2Z Landing Page

Landing page for **o2z** - Building the Future of Technology.

## 🌐 Live Site

- **Primary:** https://o2z.tech
- **Alternate:** https://www.o2z.tech

## 📁 Project Structure

```
o2z-landing/
├── dist/                      # Production files (deployed to server)
│   ├── index.html            # Main HTML file
│   ├── styles.css            # Styles with dark mode support
│   ├── script.js             # Theme toggle & animations
│   ├── logo.svg              # O2Z logo (SVG)
│   ├── logo.png              # O2Z logo (PNG)
│   ├── favicon.ico           # Favicon
│   ├── favicon-16x16.png     # Favicon 16x16
│   ├── favicon-32x32.png     # Favicon 32x32
│   ├── apple-touch-icon.png  # Apple touch icon
│   ├── android-chrome-*.png  # Android icons
│   └── site.webmanifest      # Web app manifest
├── Caddyfile.o2z             # Caddy configuration
└── README.md                 # This file
```

## 🚀 Deployment

### Server Location
**o2z-prod (Hetzner):**
- Server IP: `46.224.229.223`
- SSH: `ssh-o2zprod` or `ssh -i ~/.ssh/hetzner_otech_server omri@46.224.229.223`
- Deployment path: `/home/omri/o2z-landing/`

### Deploy Updates

```bash
# 1. Make changes to files in dist/
cd ~/omri-dev/o2z-landing/dist

# 2. Transfer to server
tar czf - . | ssh-o2zprod "cd ~/o2z-landing && tar xzf -"

# 3. Verify deployment
ssh-o2zprod "ls -la ~/o2z-landing/"
```

### Caddy Configuration

Configuration is in `/etc/caddy/Caddyfile` on server. To update:

```bash
# Edit Caddyfile.o2z locally, then:
ssh-o2zprod "sudo nano /etc/caddy/Caddyfile"

# Reload Caddy
ssh-o2zprod "sudo systemctl reload caddy"
```

## 🎨 Features

### Design
- **Responsive:** Mobile-first design, works on all devices
- **Dark Mode:** Auto-detects system preference, toggleable
- **Modern:** Clean, minimal design with gradient accents
- **Performance:** Static files, gzip compression, aggressive caching

### Content Sections
1. **Hero:** Company tagline and CTAs
2. **Products:** Showcase Ludora (live) + coming soon placeholder
3. **About:** Company values and mission
4. **Contact:** Email and LinkedIn
5. **Footer:** Legal info (עוסק מורשה) + founder credit

### Branding
- **Name:** o2z (עוזר - "helper" in Hebrew)
- **Positioning:** Company-first, minimal personal presence
- **Founder Credit:** Small mention in footer only
- **Legal:** עוסק מורשה (authorized business)

## 🔧 Technical Details

### Stack
- **Frontend:** Pure HTML/CSS/JS (no framework)
- **Server:** Caddy reverse proxy with automatic HTTPS
- **Hosting:** Hetzner o2z-prod server

### Features
- Theme toggle (light/dark mode)
- Smooth scroll navigation
- Intersection Observer animations
- SEO-friendly meta tags
- Progressive Web App manifest

### DNS Configuration

Required DNS records at domain registrar:

```
A    o2z.tech         46.224.229.223
A    www.o2z.tech     46.224.229.223
```

Caddy handles automatic HTTPS certificate provisioning via Let's Encrypt.

## 📝 Content Updates

### Update Products
Edit `dist/index.html` in the Products section:

```html
<div class="product-card featured">
    <!-- Update Ludora or add new products here -->
</div>
```

### Update Contact Info
Edit `dist/index.html` in the Contact section:

```html
<a href="mailto:YOUR_EMAIL">YOUR_EMAIL</a>
```

### Update Footer
Edit `dist/index.html` in the Footer section for legal/founder info.

## 🔒 Isolation & Security

- **Static Files Only:** No server-side processing, completely isolated
- **No Dependencies:** Runs independently of Obot1 or other services
- **Separate Port:** Served directly by Caddy (ports 80/443)
- **Security Headers:** HSTS, X-Frame-Options, CSP, etc.

## 📊 Monitoring

### Check Status
```bash
# Check Caddy status
ssh-o2zprod "sudo systemctl status caddy"

# Check Caddy logs
ssh-o2zprod "sudo journalctl -u caddy -f"

# Check site-specific logs
ssh-o2zprod "sudo tail -f /var/log/caddy/o2z-landing.log"
```

### Test Site
```bash
# Check HTTP response
curl -I https://o2z.tech

# Check certificate
ssh-o2zprod "sudo caddy list-certificates"
```

## 🎯 Future Enhancements

Potential additions (when needed):
- [ ] Contact form with backend
- [ ] Blog/news section
- [ ] Case studies for products
- [ ] Team page (when expanding)
- [ ] Hebrew language toggle

## 📄 License

Proprietary - © 2025 o2z. All rights reserved.

---

**Built with care for the o2z brand** 🚀
