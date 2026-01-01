# GitHub Personal Access Token Setup

## Create a New Classic Token

1. **Go to GitHub Token Settings:**
   https://github.com/settings/tokens/new

2. **Token Settings:**
   - **Note:** `Hoopland Save Editor - Workflow Access`
   - **Expiration:** Choose your preference (90 days, 1 year, or no expiration)
   - **Scopes:** Check these boxes:
     - ✅ `repo` (Full control of private repositories)
       - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (optional, if you plan to publish packages)

3. **Click "Generate token"**

4. **Copy the token immediately** (you won't see it again!)

5. **Update Git Credentials:**

   **Option A - macOS Keychain (Recommended):**
   ```bash
   git config --global credential.helper osxkeychain
   ```
   Then on next push, use the token as your password

   **Option B - Store in Git Config (Less Secure):**
   ```bash
   git config --global credential.helper store
   ```
   Then push - it will prompt for username and password (use token as password)

   **Option C - Update Remote URL with Token:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/isaacbc7/Hoopland_save_editor.git
   ```
   (Replace YOUR_TOKEN with your actual token)

6. **Test by pushing the workflow file:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Actions workflow"
   git push
   ```

## Security Notes

- ⚠️ Never commit tokens to git
- ⚠️ Never share your token publicly
- ✅ Tokens are stored securely in macOS Keychain (if using Option A)
- ✅ You can revoke tokens anytime at: https://github.com/settings/tokens
