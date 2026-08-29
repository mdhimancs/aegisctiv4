# GitHub Pages Deployment Guide

### ⚠️ Read Me First: Architecture & Limitations
This application is a **Full-Stack React/Node.js** app.
Before deploying to GitHub Pages, understand these limitations:
* GitHub Pages only hosts STATIC files like HTML, CSS, JavaScript.
* It cannot run the backend Node.js server (`server.ts`).
* AI features will be disabled because Gemini API calls require backend servers.
* The interactive map, dashboards, and charts will load and function perfectly.
* Do NOT overwrite `package.json` with Vue or static templates.
* The `package.json` is configured for React, Tailwind, Leaflet, and D3.
* Alternative: Host on Render.com, Google Cloud Run, or Vercel for full AI support.

---

This guide explains how to publish your website to GitHub Pages.
It also covers updating it using the direct AI Studio Export method.

---

### 🛑 Managing Website Availability: Unpublishing & Republishing

If you need to take your live website offline temporarily or permanently,
or bring it back online, follow these simple steps on GitHub:

#### 1. How to Unpublish Temporarily (Stop Traffic & Hide Site)
* What it does: Disables live URL immediately so visitors see 404 errors.
* Repository code and deployment settings remain intact for easy restoration.
1. Open your repository on GitHub.com.
2. Click on the Settings tab near top right.
3. In the left sidebar, click Pages under Code and automation.
4. Under Build and deployment, click the Source dropdown.
5. Change the Source from GitHub Actions to None.
6. Your site is now temporarily offline.

#### 2. How to Unpublish Permanently (Delete the Site & URL)
* What it does: Completely removes the GitHub Pages site and URL.
1. Follow steps above to set Pages source to None.
2. To delete all code and history, go to repository Settings.
3. Scroll to the Danger Zone at the bottom.
4. Click Delete this repository.

#### 3. How to Publish It Again (Bring Site Back Online)
* What it does: Restores your website and makes it live again.
1. Open your repository on GitHub.com and click Settings -> Pages.
2. Change the Source dropdown from None back to GitHub Actions.
3. Go to the Actions tab at the top.
4. Click on your latest workflow run or trigger a new push.
5. Wait for the green checkmark.
6. Your website will be live again instantly!

---

### Phase 1: The Initial Export (Creating the Repository)
First, we need to export your code out of AI Studio.
Create a brand new GitHub repository for your project.

1. Click the Settings / Menu icon in top right.
2. Click Export to GitHub.
3. Follow prompts to connect GitHub and create your repository.
4. Give it a name like aegis-threat-map.
5. Once export completes, click link to open your new repository.

### Phase 2: Setting up GitHub Pages (One-Time Setup)
Now we tell GitHub how to build and host your website.

1. In your new GitHub repository, click Settings.
2. On the left sidebar, click Pages.
3. Under Build and deployment, select GitHub Actions as Source.
4. Scroll to top of repository and click Actions tab.
5. Click set up a workflow yourself.
6. Name the file .github/workflows/deploy.yml.
7. Paste this exact YAML code into the editor:

```yaml 
name: Deploy static content to Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm install
      - name: Build project
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

8. Click green Commit changes "button" in top right.
9. Commit directly to the main branch.
Within minutes, your site will be live online!

---

### Phase 3: Tracking Deployment & Accessing the Live Site
Track deployment progress and find your live website link easily.

**1. How to Watch Deployment Progress**
1. Open your repository on GitHub.
2. Click Actions tab at top.
3. Click Deploy static content to Pages on left.
4. Review your recent workflow runs:
- Yellow circle: Building and deploying (takes 1-3 minutes).
- Green checkmark: Deployment successful and site is live.
- Red X: Build failed; click to check errors.

**2. How to Find Live Website URL**
GitHub provides your live link in two convenient places:

**Location A: Right Sidebar**
1. Go to repository Code tab.
2. Look at right-hand sidebar for Environments.
3. Click github-pages listed there.
4. Click View deployment to open site in new tab.

**Location B: Actions Tab**
1. Go to Actions tab.
2. Click specific workflow run with green checkmark.
3. Under Deploy to GitHub Pages job block, find live link.

---

### Phase 4: The Update Workflow (How to Make Future Changes)
Push future chat updates to your live website easily:

1. Click Settings / Menu icon in AI Studio.
2. Click Export to GitHub.
3. Select existing repository instead of creating new one.
4. Open your repository on GitHub website.
5. Click Pull requests tab at top.
6. Open automated pull request from AI Studio.
7. Click green Merge pull request "button".
8. Click Confirm merge.
9. GitHub Actions will rebuild and publish website automatically.
10. Refresh your live URL in 2 minutes to view updates.
