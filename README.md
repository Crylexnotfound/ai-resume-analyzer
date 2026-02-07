# AI Master ATS (Vanilla JS Edition)

A high-performance, privacy-first Resume Analyzer built with **Puter.js**.
Analyzes resumes against job descriptions using AI to provide ATS scores and actionable feedback.

## 🚀 Quick Start

### 1. Prerequisites
-   **VS Code** text editor.
-   **Live Server** extension for VS Code (Required for Puter.js).

### 2. Run the Project
1.  Open this folder in VS Code.
2.  Right-click `index.html`.
3.  Select "Open with Live Server".
4.  The app will launch at `http://127.0.0.1:5500`.

## 🐙 GitHub Setup

Since you have already initialized the local repository, follow these steps to connect it to GitHub:

1.  **Create a Repository on GitHub**:
    *   Go to [github.com/new](https://github.com/new).
    *   Repository Name: `ai-resume-analyzer` (or your preferred name).
    *   **Uncheck** "Initialize this repository with a README" (keep it empty).
    *   Click **Create repository**.

2.  **Connect & Push**:
    *   Copy the HTTPS URL of your new repository (e.g., `https://github.com/YOUR_USERNAME/ai-resume-analyzer.git`).
    *   Open your VS Code terminal (Ctrl+`).
    *   Run the following commands:

```bash
# Add the remote link (replace URL with yours)
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git

# Initial stage and commit
git add .
git commit -m "Initial Logic Implementation"

# Rename branch to main (best practice)
git branch -M main

# Push your code
git push -u origin main
```

## 🛠 Tech Stack
-   **Frontend**: HTML5, Vanilla JavaScript (ES Module Pattern).
-   **Styling**: Tailwind CSS (CDN).
-   **Platform**: Puter.js (Auth, AI, FileSystem).
-   **PDF Parsing**: PDF.js.
