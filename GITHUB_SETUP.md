# Adding This Project to GitHub (jacobr12)

## Step 1: Initialize Git Repository

Open terminal in the project root directory (`/Users/Tyler/Documents/model cards`) and run:

```bash
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Transparency Portal for Public Algorithms"
```

## Step 4: Create Repository on GitHub

1. Go to [github.com](https://github.com) and sign in as **jacobr12**
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `transparency-portal` (or any name you like)
4. Description: "Transparency Portal for Public Algorithms - Model cards for public-sector AI systems"
5. Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (we already have one)
7. Click **"Create repository"**

## Step 5: Connect and Push

GitHub will show you commands. Use these (replace `YOUR-REPO-NAME` with your actual repo name):

```bash
git remote add origin https://github.com/jacobr12/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

If you named it `transparency-portal`, the command would be:
```bash
git remote add origin https://github.com/jacobr12/transparency-portal.git
git branch -M main
git push -u origin main
```

## Step 6: Verify

Go to `https://github.com/jacobr12/YOUR-REPO-NAME` and you should see all your files!

---

## Troubleshooting

### If you get authentication errors:
GitHub no longer accepts passwords. You need a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Give it a name like "transparency-portal"
4. Select scopes: `repo` (full control)
5. Copy the token
6. When pushing, use the token as your password (username is still `jacobr12`)

Or use SSH instead:
```bash
git remote set-url origin git@github.com:jacobr12/YOUR-REPO-NAME.git
```

### If you need to update later:
```bash
git add .
git commit -m "Your commit message"
git push
```

