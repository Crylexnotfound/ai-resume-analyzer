/**
 * PuterService - Core Logic Store
 * Adapted from app/lib/puter.ts for Vanilla JS
 * Replaces 'zustand' with a custom Pub/Sub pattern.
 */

class PuterServiceStore {
    constructor() {
        this.state = {
            isLoading: true,
            error: null,
            puterReady: false,
            auth: {
                user: null,
                isAuthenticated: false
            }
        };
        this.listeners = new Set();
        this.init();
    }

    // --- State Management ---
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    getPuter() {
        return (typeof window !== "undefined" && window.puter) ? window.puter : null;
    }

    setError(msg) {
        console.error("[PuterService Error]", msg);
        this.setState({
            error: msg,
            isLoading: false,
            // Reset auth on critical error if needed, or keep partial state
        });
    }

    // --- Initialization ---
    init() {
        const puter = this.getPuter();
        if (puter) {
            this.setState({ puterReady: true });
            this.checkAuthStatus();
            return;
        }

        // Poll for Puter.js
        const interval = setInterval(() => {
            if (this.getPuter()) {
                clearInterval(interval);
                this.setState({ puterReady: true });
                this.checkAuthStatus();
            }
        }, 100);

        // Timeout after 10s
        setTimeout(() => {
            clearInterval(interval);
            if (!this.getPuter()) {
                this.setError("Puter.js failed to load within 10 seconds");
            }
        }, 10000);
    }

    // --- Auth ---
    async checkAuthStatus() {
        const puter = this.getPuter();
        if (!puter) {
            this.setError("Puter.js not available");
            return false;
        }

        this.setState({ isLoading: true, error: null });

        try {
            // Updated API check
            const isSignedIn = await puter.auth.isSignedIn();
            if (isSignedIn) {
                const user = await puter.auth.getUser();
                this.setState({
                    isLoading: false,
                    auth: { user: user, isAuthenticated: true }
                });
                return true;
            } else {
                this.setState({
                    isLoading: false,
                    auth: { user: null, isAuthenticated: false }
                });
                return false;
            }
        } catch (err) {
            this.setError(err instanceof Error ? err.message : "Failed to check auth status");
            return false;
        }
    }

    async signIn() {
        const puter = this.getPuter();
        if (!puter) return;

        this.setState({ isLoading: true, error: null });
        try {
            await puter.auth.signIn();
            await this.checkAuthStatus();
        } catch (err) {
            this.setError("Sign in failed: " + err);
        }
    }

    async signOut() {
        const puter = this.getPuter();
        if (!puter) return;

        this.setState({ isLoading: true, error: null });
        try {
            await puter.auth.signOut();
            this.setState({
                auth: { user: null, isAuthenticated: false },
                isLoading: false
            });
        } catch (err) {
            this.setError("Sign out failed");
        }
    }

    // --- File System (FS) ---
    async write(path, data) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");
        return puter.fs.write(path, data);
    }

    async read(path) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");
        return puter.fs.read(path);
    }

    async readDir(path) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");
        return puter.fs.readdir(path);
    }

    async upload(files) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");
        return puter.fs.upload(files);
    }

    async deleteFile(path) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");
        return puter.fs.delete(path);
    }

    // --- AI ---
    async chat(prompt, imageURL, testMode, options) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");
        return puter.ai.chat(prompt, imageURL, testMode, options);
    }

    async feedback(path, message) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");

        // Construct the prompt for Claude/GPT
        // Based on reference app/lib/puter.ts logic
        return puter.ai.chat(
            [
                {
                    role: "user",
                    content: [
                        { type: "file", puter_path: path },
                        { type: "text", text: message }
                    ]
                }
            ],
            { model: "claude-3-5-sonnet" } // Using a high-quality model
        );
    }

    async img2txt(image, testMode) {
        const puter = this.getPuter();
        if (!puter) throw new Error("Puter not ready");
        return puter.ai.img2txt(image, testMode);
    }

    // --- Key-Value (KV) ---
    async getKV(key) {
        const puter = this.getPuter();
        if (!puter) return null;
        return puter.kv.get(key);
    }

    async setKV(key, value) {
        const puter = this.getPuter();
        if (!puter) return false;
        return puter.kv.set(key, value);
    }

    async flushKV() {
        const puter = this.getPuter();
        if (!puter) return false;
        return puter.kv.flush();
    }
}

// Export singleton
const PuterService = new PuterServiceStore();
// Make it available globally for console debugging
window.PuterService = PuterService;
export default PuterService;
