// initialize arrays
const settingsButtons = [
    accountInfoButton = document.getElementById('acct-dtl-btn'),
    securityButton = document.getElementById('security-btn'),
    appearButton = document.getElementById('appear-btn'),
    notifsButton = document.getElementById('notif-btn')
]

const settingsURLs = [
    'settings/profile',
    'settings/security',
    'settings/appearance',
    'settings/notif',
]

const settingsJSFiles = [
    'profile.js',
    'security.js',
    'appear.js',
    'notif.js',
]

const contentContainer = document.getElementById('settings-content');


// load everything when content is loaded
document.addEventListener('DOMContentLoaded', () => {
    newPage(0);
});

// newPage function to get a new page
async function newPage(pageIndex) {
    let newContent = `Fetching...`;
    contentContainer.innerHTML = newContent;
    
    try {
        newContent = await fetchSettingsPage(pageIndex);
        if (!newContent) {
            throw new Error('Empty response from server');
        }
        await handleButtonChange(pageIndex);
        contentContainer.innerHTML = newContent;
        
        // Fetch and append the corresponding JavaScript file
        await loadSettingsScript(pageIndex);
    } catch (error) {
        console.error('Error loading settings page:', error);
        contentContainer.innerHTML = '<div class="error-message">Failed to load settings page. Please try again.</div>';
    }
}

// fetchSettingsPage function to fetch a new settings page
async function fetchSettingsPage(pageIndex) {
    let pageURL = settingsURLs[pageIndex];

    try {
        const response = await fetch(pageURL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching settings page:', error);
        throw error; // Re-throw to let newPage handle the display
    }
}

// handleButtonChange function to change active button
async function handleButtonChange(activeIndex) {
    settingsButtons.forEach((button, index) => {
        button.style.fontWeight = index === activeIndex ? 'bold' : 'normal';
    });
}

// loadSettingsScript function to fetch and execute JavaScript for each settings page
async function loadSettingsScript(pageIndex) {
    const scriptFileName = settingsJSFiles[pageIndex];
    const scriptURL = `static/javascript/settings/${scriptFileName}`;
    
    try {
        const response = await fetch(scriptURL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const scriptContent = await response.text();
        
        // Remove any existing settings scripts first
        const existingScripts = document.querySelectorAll('script[data-settings-script]');
        existingScripts.forEach(script => script.remove());
        
        // Create a script element with the content
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('data-settings-script', pageIndex);
        scriptElement.textContent = scriptContent;
        
        // Add the script to the contentContainer for DOM presence
        contentContainer.appendChild(scriptElement);
        
        // Execute the script content after a small delay to ensure DOM elements are ready
        try {
            eval(scriptContent);
            
            // For scripts that need to run after DOM is ready, give them a moment
            setTimeout(() => {
                // Page-specific initialization functions
                switch(pageIndex) {
                    case 0: // profile.js
                        if (typeof initializeProfile === 'function') {
                            initializeProfile();
                        }
                        break;
                    case 1: // security.js
                        // Add security initialization here if needed
                        break;
                    case 2: // appear.js
                        if (typeof handleDarkToggle === 'function') {
                            handleDarkToggle();
                        }
                        break;
                    case 3: // notif.js
                        if (typeof checkboxHandler === 'function') {
                            checkboxHandler();
                        }
                        break;
                }
            }, 50);
        } catch (execError) {
            console.error(`Error executing script ${scriptFileName}:`, execError);
            throw execError;
        }
        
    } catch (error) {
        console.warn(`Failed to load settings script ${scriptFileName}:`, error);
        // Don't throw - page should still work without the script
    }
}
