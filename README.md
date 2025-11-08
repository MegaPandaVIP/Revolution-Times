# ⚔️ Le Guillotine Gazette ⚔️

*"All the News That's Fit to Behead"*

A satirical French Revolution-themed news website built with **Tailwind CSS** and featuring a comment system that saves each comment to individual text files directly in the repository.

## Features

- 📰 **5 Pages of Revolutionary Content:**
  - Home page with 6 featured articles
  - Politics & Rebellion section
  - Royals & Drama section
  - Gossip & Scandals section
  - Fashion & Lifestyle section

- 🎨 **Beautiful Tailwind CSS Design:**
  - Responsive layout
  - Animated components
  - Custom color scheme
  - Hover effects and transitions

- 💬 **Comment System:**
  - Submit comments on any page
  - Each comment automatically saved to a separate `.txt` file in the `comments/` folder
  - Comments saved directly to the GitHub repository via GitHub API
  - Comments also stored locally in browser as backup

## Setup Instructions

### 1. Create a GitHub Personal Access Token

To enable comment saving to the repository, you need to create a GitHub Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "Le Guillotine Gazette Comments"
4. Select the following permissions:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again!)

### 2. Add Token to the JavaScript File

1. Open `gazette-scripts.js`
2. Find the `GITHUB_CONFIG` section at the top:
   ```javascript
   const GITHUB_CONFIG = {
       owner: 'MegaPandaVIP',
       repo: 'Revolution-Times',
       branch: 'main',
       token: '', // Add your token here
   };
   ```
3. Paste your token between the quotes:
   ```javascript
   token: 'ghp_your_token_here',
   ```
4. Commit and push the changes

### 3. Deploy to GitHub Pages

1. Go to your repository Settings → Pages
2. Under "Source", select your branch (usually `main`)
3. Click "Save"
4. Your site will be available at: `https://megapandavip.github.io/Revolution-Times/`

## How the Comment System Works

When a user submits a comment:

1. **Frontend captures the comment** (`gazette-scripts.js`):
   - Gets the user's name and comment text
   - Creates a timestamp

2. **Saves to GitHub via API**:
   - Creates a unique filename: `comment_[timestamp]_[random].txt`
   - Formats the comment nicely
   - Uses GitHub API to create a file in the `comments/` folder
   - Makes a commit to the repository

3. **Displays the comment**:
   - Shows the comment immediately on the page
   - Stores a backup in localStorage

4. **Comment File Format**:
   ```
   ============================================================
   LE GUILLOTINE GAZETTE - READER COMMENT
   ============================================================

   Page: /index.html
   Author: Jean-Paul Citizen
   Timestamp: 2025-11-08T10:30:00.000Z
   Posted: 08/11/2025 10:30:00

   ------------------------------------------------------------
   COMMENT:
   ------------------------------------------------------------

   This is a sample comment about the revolution!

   ============================================================
   Saved to repository: 08/11/2025 10:30:15
   ============================================================
   ```

## Project Structure

```
Revolution-Times/
├── index.html          # Home page
├── politics.html       # Politics section
├── royals.html         # Royals section
├── gossip.html         # Gossip section
├── fashion.html        # Fashion section
├── gazette-scripts.js  # Frontend JavaScript with GitHub API integration
├── comments/           # Folder for comment text files
└── README.md          # This file
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Token in Public Repo**: If your repository is public, your token will be visible to everyone. This means anyone can:
   - Submit comments to your repository
   - Make commits using your token
   
2. **Recommended Solutions**:
   - Use a bot account or separate GitHub account for comments
   - Set up repository rules to protect important branches
   - Regularly rotate your token
   - Consider using GitHub Actions with secrets for more security

3. **Alternative Approach**: For better security, you could:
   - Use GitHub Issues as a comment backend
   - Use a third-party comment service (Disqus, Utterances, etc.)
   - Set up a serverless function (Netlify Functions, Vercel Functions)

## Technologies Used

- **Frontend:**
  - HTML5
  - Tailwind CSS (via CDN)
  - Vanilla JavaScript
  - GitHub API

## How to Use (For Visitors)

1. Browse the revolutionary news articles
2. Scroll to the comment section on any page
3. Enter your name and comment
4. Click "Submit Comment"
5. Your comment will be saved to the repository and displayed on the page!

## Development

To test locally:
1. Simply open `index.html` in your browser
2. Comments will save locally if no GitHub token is configured
3. Once token is added, comments will save to GitHub

## Notes

- Each comment creates a new commit to the repository
- Comments are visible in the `comments/` folder
- The system works entirely client-side (no server needed!)
- Perfect for GitHub Pages static hosting

## License

© 1793 Le Guillotine Gazette. All rights reserved.

---

*Vive la Révolution! 🎉*
