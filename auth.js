import PuterService from '../lib/puter-service.js';

const ui = {
    authWall: document.getElementById('auth-wall'),
    appInterface: document.getElementById('app-interface'),
    authBtn: document.getElementById('auth-btn'),
    signOutBtn: document.getElementById('sign-out-btn'),
    usernameDisplay: document.getElementById('username-display'),
    loadingOverlay: document.getElementById('loading-overlay')
};

// --- Auth Handling ---
const handleAuthChange = (state) => {
    // 1. Loading State
    if (state.isLoading) {
        ui.loadingOverlay.classList.remove('hidden');
    } else {
        ui.loadingOverlay.classList.add('hidden');
    }

    // 2. Auth State
    if (state.auth.isAuthenticated && state.auth.user) {
        // Logged In
        ui.authWall.classList.add('hidden');
        ui.appInterface.classList.remove('hidden');
        ui.usernameDisplay.innerText = state.auth.user.username;
    } else {
        // Logged Out
        ui.authWall.classList.remove('hidden');
        ui.appInterface.classList.add('hidden');
        ui.usernameDisplay.innerText = '';
    }

    // 3. Error State
    if (state.error) {
        console.error("Auth Error:", state.error);
        // Optionally show a toast/alert
    }
};

// --- Initial Setup ---
const initAuth = () => {
    // Subscribe to PuterService updates
    PuterService.subscribe(handleAuthChange);

    // Initial check (force update UI based on current state)
    handleAuthChange(PuterService.state);

    // Event Listeners
    ui.authBtn.addEventListener('click', () => {
        PuterService.signIn();
    });

    ui.signOutBtn.addEventListener('click', () => {
        PuterService.signOut();
    });
}

// Start
initAuth();
