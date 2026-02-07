import PuterService from '../lib/puter-service.js';
import visuals from './visuals.js';

// --- Constants (Adapted from Reference) ---
const AIResponseFormat = `{
    "overallScore": 0, // number max 100
    "ATS": { "score": 0, "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}] },
    "toneAndStyle": { "score": 0, "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}] },
    "content": { "score": 0, "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}] },
    "structure": { "score": 0, "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}] },
    "skills": { "score": 0, "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}] }
}`;

const prepareInstructions = (jobDesc) => `
You are an expert ATS (Applicant Tracking System) resume analyzer.
Analyze this resume against the provided job description.
Be critical and thorough.
Job Description:
${jobDesc}

Respond ONLY with valid JSON matching this format:
${AIResponseFormat}
`;

// --- State ---
let selectedFile = null;
let fileTextContent = "";

// --- DOM Elements ---
const dom = {
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    fileNameDisplay: document.getElementById('file-name-display'),
    jobDescInput: document.getElementById('job-desc'),
    analyzeBtn: document.getElementById('analyze-btn')
};

// --- File Handling ---
const handleFileSelect = async (file) => {
    if (!file) return;

    // UI Update
    dom.fileNameDisplay.innerText = file.name;
    dom.fileNameDisplay.classList.remove('hidden');
    selectedFile = file;

    // Read Content
    try {
        if (file.type === 'application/pdf') {
            fileTextContent = await readPdf(file);
        } else {
            fileTextContent = await readText(file);
        }
        console.log("File loaded, length:", fileTextContent.length);
    } catch (err) {
        console.error("Read error:", err);
        alert("Could not read file. Please try a simple text file or a different PDF.");
    }
};

const readText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

const readPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + "\n";
    }
    return fullText;
};

// --- Event Listeners: Drag & Drop ---
dom.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.dropZone.classList.add('border-blue-400', 'bg-blue-50');
});

dom.dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dom.dropZone.classList.remove('border-blue-400', 'bg-blue-50');
});

dom.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    if (e.dataTransfer.files.length) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
});

dom.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileSelect(e.target.files[0]);
    }
});

// --- Analysis Logic ---
dom.analyzeBtn.addEventListener('click', async () => {
    const jobDesc = dom.jobDescInput.value.trim();

    // Validation
    if (!PuterService.state.auth.isAuthenticated) {
        alert("Please sign in first!");
        return;
    }
    if (!fileTextContent) {
        alert("Please upload a resume first.");
        return;
    }
    if (!jobDesc) {
        alert("Please enter a job description.");
        return;
    }

    // Loading State
    dom.analyzeBtn.innerText = "Analyzing...";
    dom.analyzeBtn.disabled = true;
    dom.analyzeBtn.classList.add('opacity-75', 'cursor-not-allowed');

    try {
        // Construct Prompt
        const prompt = prepareInstructions(jobDesc);

        // Call Puter AI
        const response = await PuterService.chat([
            {
                role: "user",
                content: [
                    { type: "text", text: `RESUME CONTENT:\n${fileTextContent}` },
                    { type: "text", text: prompt }
                ]
            }
        ]);

        console.log("AI Response:", response);

        // Parse JSON
        let resultData;
        const rawContent = response.message.content; // Might need adjustment based on strict format

        // Attempt to extract JSON if wrapped in markdown
        const jsonMatch = typeof rawContent === 'string' ? rawContent.match(/\{[\s\S]*\}/) : null;
        if (jsonMatch) {
            resultData = JSON.parse(jsonMatch[0]);
        } else if (typeof rawContent === 'object') {
            resultData = rawContent;
        } else {
            resultData = JSON.parse(rawContent);
        }

        // Render Visuals
        visuals.renderFeedback(resultData);

        // Save to Puter FS (Optional - Feature "Resume Storage")
        if (selectedFile) {
            // We can implement saving the file here later
            // await PuterService.fs.write(selectedFile.name, selectedFile);
        }

    } catch (err) {
        console.error("Analysis Failed:", err);
        alert("Analysis failed. Please try again. Error: " + err.message);
    } finally {
        dom.analyzeBtn.innerHTML = `<span>Analyze Resume</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
        dom.analyzeBtn.disabled = false;
        dom.analyzeBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
});
