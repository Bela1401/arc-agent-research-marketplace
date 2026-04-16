# GitHub Publishing Guide

## Before pushing

Make sure these files do **not** get committed:

- `.env.local`
- `.env.production`
- any Circle recovery `.dat` files
- `circle-recovery/`
- `.next/`
- `node_modules/`

If any real secrets were ever exposed outside local files, rotate them after publishing.

## Step 1. Install Git on Windows

Download and install:

- [Git for Windows](https://git-scm.com/download/win)

Recommended install settings:

- use Git from the command line and third-party software
- checkout Windows-style, commit Unix-style line endings
- bundled OpenSSH is fine

After installation, reopen PowerShell and verify:

```powershell
git --version
```

## Step 2. Configure Git identity

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Optional:

```powershell
git config --global init.defaultBranch main
```

## Step 3. Initialize the repository

From the project root:

```powershell
git init
git branch -M main
```

## Step 4. Review what will be committed

```powershell
git status
```

You should **not** see `.env.local`, `circle-recovery`, or `.next` in the staged file list.

## Step 5. Create the first commit

```powershell
git add .
git commit -m "Initial hackathon submission"
```

## Step 6. Create a public GitHub repository

Create a new repo on GitHub, for example:

- `arc-agent-research-marketplace`

Keep it:

- `Public`
- without adding a new README
- without adding `.gitignore`
- without adding a license during creation

## Step 7. Connect local repo to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/arc-agent-research-marketplace.git
git push -u origin main
```

If GitHub asks for authentication, sign in with your browser or use a Personal Access Token.

## Step 8. Final repo checks

Confirm the GitHub repo shows:

- source code
- `README.md`
- docs
- no secrets
- no local recovery files

## Nice-to-have after push

- add a project description
- add topics like `arc`, `circle`, `hackathon`, `nextjs`, `usdc`, `agentic-economy`
- pin the repository on your profile
- connect the same repo to Vercel for deployment
