# 🚀 Deployment Guide: GitHub + Netlify

Complete step-by-step guide to deploy Money Mapper Monitor from local repository to GitHub and then to Netlify for live production.

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ Git installed and initialized in your project (`git init` - already done)
- ✅ GitHub account ([Sign up here](https://github.com/join))
- ✅ Netlify account ([Sign up here](https://app.netlify.com/signup))
- ✅ Project builds successfully (`npm run build`)
- ✅ `.env` file configured with Supabase credentials

---

## 📦 Part 1: Push to GitHub

### Step 1: Create `.gitignore` File

Make sure you have `.gitignore` to exclude unnecessary files:

```bash
# Check if .gitignore exists
ls -la | grep .gitignore

# If not exists, create it
touch .gitignore
```

Verify `.gitignore` contains:

```
# Dependencies
node_modules/

# Build outputs
dist/
dist-ssr/

# Environment variables
.env
.env.local
.env.*.local

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/

# Misc
*.orig
```

### Step 2: Stage All Files

```bash
# Check current status
git status

# Add all files to staging
git add .

# Verify staged files
git status
```

### Step 3: Create Initial Commit

```bash
# Create commit with comprehensive message
git commit -m "feat: Complete Dashboard UI Refinement with Modern Component Architecture

- Implemented component-based architecture (MoneyBookSelector, StatsCards, PocketsManager, AllocationsHistory, AllocationDialog)
- Created layout system (DefaultLayout & BlankLayout) for consistent app structure
- Restructured dashboard with responsive 2-column grid layout
- Added three-dots menu pattern for all item actions
- Implemented inline editing for money books and pockets
- Enhanced empty states with centered design and simple dialog
- Added copy-to-clipboard feature for allocation amounts
- Improved responsive design with mobile-friendly layout
- Applied glass morphism styling with backdrop blur effects
- Added loading states, skeleton loaders, and smooth animations"
```

### Step 4: Create GitHub Repository

**Option A: Via GitHub Website (Recommended for beginners)**

1. Go to [github.com/new](https://github.com/new)
2. Fill in repository details:
   - **Repository name**: `money-mapper-monitor`
   - **Description**: `A modern web app for managing personal finance allocation`
   - **Visibility**: Choose `Public` or `Private`
   - **DO NOT** initialize with README (we already have one)
   - **DO NOT** add .gitignore (we already have one)
   - **License**: Choose if desired (e.g., MIT)
3. Click **"Create repository"**

**Option B: Via GitHub CLI (For advanced users)**

```bash
# Install GitHub CLI if not installed
# macOS: brew install gh
# Check: gh --version

# Login to GitHub
gh auth login

# Create repository
gh repo create money-mapper-monitor --public --source=. --remote=origin
```

### Step 5: Connect Local Repo to GitHub

After creating the GitHub repository, you'll see instructions. Follow these:

```bash
# Add remote origin
git remote add origin https://github.com/zulkamaula/money-mapper-monitor.git

# Verify remote
git remote -v

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication error:**

```bash
# For HTTPS: Use Personal Access Token
# 1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
# 2. Generate new token with 'repo' scope
# 3. Copy the token
# 4. Use it as password when pushing

# OR configure credential helper
git config --global credential.helper cache

# OR switch to SSH (recommended)
# See: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Step 6: Verify on GitHub

1. Go to `https://github.com/zulkamaula/money-mapper-monitor`
2. Check that all files are uploaded
3. Verify README is displayed correctly
4. Check commit message is shown

### Step 7: Create Tags (Optional but Recommended)

```bash
# Create version tag
git tag -a v1.0.0 -m "Initial release: Dashboard UI Refinement"

# Push tags to GitHub
git push origin --tags

# Create release on GitHub (via website)
# Go to: https://github.com/zulkamaula/money-mapper-monitor/releases
# Click "Create a new release"
# Choose tag v1.0.0
# Add release notes
# Publish release
```

---

## 🌐 Part 2: Deploy to Netlify

### Method 1: Netlify UI (Easiest - Recommended)

#### Step 1: Sign Up / Login to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up with GitHub account (recommended)
3. Authorize Netlify to access your repositories

#### Step 2: Import Project

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify (if first time)
4. Search and select `money-mapper-monitor` repository
5. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

#### Step 3: Add Environment Variables

1. Scroll down to **"Environment variables"**
2. Click **"Add environment variables"**
3. Add the following:

   | Key                      | Value                     |
   | ------------------------ | ------------------------- |
   | `VITE_SUPABASE_URL`      | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key    |

4. Click **"Deploy site"**

#### Step 4: Wait for Deployment

1. Netlify will start building your site
2. Watch the deploy logs
3. Wait for "Site is live" message (usually 2-3 minutes)

#### Step 5: Get Your Live URL

Your site will be available at:

```
https://random-name-123456.netlify.app
```

#### Step 6: Customize Domain (Optional)

**Option A: Use Netlify Subdomain**

1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change to: `money-mapper-monitor` (if available)
4. New URL: `https://money-mapper-monitor.netlify.app`

**Option B: Use Custom Domain**

1. Buy domain from registrar (Namecheap, GoDaddy, etc.)
2. In Netlify: **Domain management** → **"Add custom domain"**
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

---

### Method 2: Netlify CLI (For Developers)

#### Step 1: Install Netlify CLI

```bash
# Install globally
npm install -g netlify-cli

# Verify installation
netlify --version
```

#### Step 2: Login to Netlify

```bash
# Login via browser
netlify login

# Browser will open, authorize the CLI
```

#### Step 3: Initialize Netlify Project

```bash
# In your project directory
netlify init

# Follow the prompts:
# 1. "Create & configure a new site" → Yes
# 2. Choose your team
# 3. Site name: money-mapper-monitor (or leave blank for random)
# 4. Build command: npm run build
# 5. Publish directory: dist
# 6. Netlify Functions directory: (leave empty)
```

#### Step 4: Set Environment Variables

```bash
# Set environment variables
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"

# Verify
netlify env:list
```

#### Step 5: Deploy

```bash
# Build first
npm run build

# Deploy to production
netlify deploy --prod

# Or deploy to draft URL first (for testing)
netlify deploy

# If happy with draft, promote to production
netlify deploy --prod
```

#### Step 6: Open Site

```bash
# Open in browser
netlify open:site
```

---

## 🔄 Part 3: Continuous Deployment (Auto-deploy on Push)

Netlify automatically enables continuous deployment when you connect via GitHub.

### How It Works

1. **You push code to GitHub**:

   ```bash
   git add .
   git commit -m "feat: Add new feature"
   git push origin main
   ```

2. **Netlify detects the push** and automatically:
   - Pulls latest code
   - Runs `npm install`
   - Runs `npm run build`
   - Deploys to production

3. **Your site is updated** (usually within 2-3 minutes)

### Deploy Previews for Pull Requests

1. Create a new branch:

   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and push:

   ```bash
   git add .
   git commit -m "feat: Add new feature"
   git push origin feature/new-feature
   ```

3. Create Pull Request on GitHub

4. Netlify automatically creates a **Deploy Preview**
   - Unique URL for testing
   - Comment added to PR with preview link
   - Test before merging to main

---

## 📊 Part 4: Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Site loads without errors
- [ ] Login/signup works
- [ ] Dashboard displays correctly
- [ ] Can create money books
- [ ] Can create pockets
- [ ] Can create allocations
- [ ] Mobile responsive works
- [ ] All images/assets load

### ✅ Configure Netlify Settings

1. **SSL Certificate** (Auto-enabled by Netlify)
   - Go to **Domain settings** → **HTTPS**
   - Verify SSL is enabled
   - Force HTTPS: Enable

2. **Redirect Rules** (if needed)
   - Create `netlify.toml` in root:

   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Headers** (Security)
   - Add to `netlify.toml`:

   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "no-referrer-when-downgrade"
   ```

4. **Build Settings**
   - Node version: `18` or `20`
   - Add to `netlify.toml`:
   ```toml
   [build.environment]
     NODE_VERSION = "18"
   ```

### ✅ Monitor & Analytics

1. **Netlify Analytics** (Optional, Paid)
   - Go to **Analytics** tab
   - Enable if desired

2. **Function Logs** (if using functions)
   - Go to **Functions** tab
   - Monitor execution logs

3. **Deploy Notifications**
   - Go to **Site settings** → **Build & deploy** → **Deploy notifications**
   - Add email or Slack notifications

---

## 🔧 Troubleshooting

### Build Fails on Netlify

**Error: `Command failed with exit code 1`**

1. Check build logs on Netlify
2. Common issues:
   - Missing dependencies
   - TypeScript errors
   - Environment variables not set

**Solution:**

```bash
# Test build locally first
npm run build

# Check for errors
npm run type-check
npm run lint
```

### Environment Variables Not Working

**Error: Supabase connection fails**

1. Verify variables in Netlify dashboard
2. Variable names must match exactly: `VITE_SUPABASE_URL`
3. Re-deploy after adding variables:
   - Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Site Shows 404 for Routes

**Error: Direct URLs return 404**

Add redirect rule:

**Method 1: Create `_redirects` file in `public/` folder:**

```
/*    /index.html   200
```

**Method 2: Add to `netlify.toml`:**

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Large Build Size

**Error: Build takes too long or fails**

Optimize:

```bash
# Analyze bundle size
npm run build -- --analyze

# Remove unused dependencies
npm prune

# Check package.json for unnecessary packages
```

---

## 🎯 Quick Reference Commands

### GitHub Workflow

```bash
# Daily workflow
git pull origin main              # Get latest changes
git checkout -b feature/xxx       # Create feature branch
# ... make changes ...
git add .                         # Stage changes
git commit -m "feat: Description" # Commit
git push origin feature/xxx       # Push to GitHub
# Create PR on GitHub → Merge → Auto-deploy on Netlify

# Update main branch
git checkout main
git pull origin main
git branch -d feature/xxx         # Delete local branch
git push origin --delete feature/xxx  # Delete remote branch
```

### Netlify CLI Commands

```bash
netlify status           # Check site status
netlify open             # Open Netlify dashboard
netlify open:site        # Open live site
netlify deploy --prod    # Manual production deploy
netlify logs             # View deploy logs
netlify env:list         # List environment variables
netlify build            # Test build locally
```

---

## 🎉 Success! Your App is Live

Your Money Mapper Monitor is now:

✅ **Version controlled** on GitHub  
✅ **Automatically deployed** on Netlify  
✅ **SSL secured** (HTTPS)  
✅ **Globally distributed** (CDN)  
✅ **Continuously deployed** (Push to deploy)

**Live URL**: `https://your-site-name.netlify.app`

---

## 📱 Share Your Project

Update your README with the live link:

```markdown
## 🌐 Live Demo

Visit the live application: [Money Mapper Monitor](https://your-site-name.netlify.app)
```

---

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Docs](https://docs.github.com/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Guides](https://supabase.com/docs)
- [Vue 3 Best Practices](https://vuejs.org/guide/best-practices/)

---

**🚀 Happy Deploying!**
