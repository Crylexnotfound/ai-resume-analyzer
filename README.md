# AIRA - AI Resume Analyzer

AIRA is a high-performance, AI-driven resume analysis platform designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). Using advanced Large Language Models (LLMs) via the Puter SDK, AIRA provides deterministic scoring, actionable feedback, and a conversational career strategist interface.

## 🚀 Concept
AIRA bridges the gap between hiring managers and top candidates by providing deep, heuristic-based resume reviews. It identifies structural weaknesses, keyword gaps, and tone inconsistencies, empowering users to refine their profiles with surgical precision.

## 🛠️ Tech Stack
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: **Tailwind CSS** (via Play CDN) – Used for layout, utility classes, and responsive design across `index.html`.
- **Backend & AI**: **Puter SDK** – Powers the authentication, file storage (KV), and AI chat/analysis features.
- **PDF Parsing**: **PDF.js** – Used to extract raw text content from uploaded PDF resumes.
- **PDF Export**: **jsPDF** – Used to generate downloadable analysis reports.
- **Visual Effects**: Custom vanilla JS implementations for 3D tilt effects and cinematic scroll reveals.

## 📁 Project Structure

### Root Directory
- `index.html`: The main application entry point. Contains the landing page, dashboard views, and the primary UI structure.
- `style.css`: Custom CSS for glassmorphism effects, custom animations, and brand-specific styles (e.g., `.glass-card`, `.reveal-cinematic`).
- `.gitignore`: Standard git configuration to exclude node modules and IDE metadata.

### `/js` - Logic & Interactivity
- `animations.js`: Manages intersection observers for scroll-trigger reveals and smooth-scrolling Table of Contents.
- `auth.js`: Handles user authentication flow, session persistence, and UI state toggling between Landing and Dashboard.
- `logic.js`: The heart of the application. Orchestrates file handling, AI analysis prompts, and interactive chat assistant communication.
- `parser.js`: Robust text extraction utility for both Plain Text (.txt) and PDF files.
- `tilt.js`: Implements a premium 3D parallax tilt effect for dashboard cards and features.
- `validator.js`: Ensures input integrity by validating file content and job descriptions before AI submission.
- `visuals.js`: Manages the DOM, rendering analysis gauges, feedback lists, and the real-time chat interface.

### `/lib` - Core Services
- `puter-service.js`: A singleton abstraction layer for the Puter SDK. Handles authentication handshake, AI chat requests, and key-value storage.


