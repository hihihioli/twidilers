// This page outline sucks. I need perm from backend to rearrange it into a template which makes so much more sense

// This script hides/shows divs if menu bars are clicked.
// It fetches the IDs of the divs so it can hide them
const settingsDivs = [
    accountInfo = document.getElementById('acct-dtl-content'),
    security = document.getElementById('security-content'),
    appearance = document.getElementById('appear-content'),
    notif = document.getElementById('notif-content')
]

const settingsButtons = [
    accountInfoButton = document.getElementById('acct-dtl-btn'),
    securityButton = document.getElementById('security-btn'),
    appearButton = document.getElementById('appear-btn'),
    notifsButton = document.getElementById('notif-btn')
]

// Sets the first div to be shown and the rest to be hidden
settingsDivs.forEach((div, index) => {
    div.style.display = index === 0 ? 'block' : 'none';
})

// Sets the first button to be bold and the rest to be normal
settingsButtons.forEach((button, index) => {
    button.style.fontWeight = index === 0 ? 'bold' : 'normal';
})

function newPage(i) {
    // Hides all divs
    settingsDivs.forEach((div) => (div.style.display = 'none'));
    // Shows the div in i index
    settingsDivs[i].style.display = 'block';
    // Normalizes all buttons
    settingsButtons.forEach((button) => (button.style.fontWeight = 'normal'));
    // Bolds the button in i index
    settingsButtons[i].style.fontWeight = 'bold';
}


// This script promts an 'Are you sure?' textbox when clicking the button to delete your account
function checkDelete(event) {
    event.preventDefault()
    if (confirm('Are you sure you want to delete your account?') == true) {
        const hiddenInput = document.createElement('input'); //creates a hidden input so 'delete' is still in request.form (using submit() removes it for some reason)
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'delete';
        document.getElementById('delete-account').appendChild(hiddenInput);
        document.getElementById('delete-account').submit()
    }
}

// Submits the image when uploading a profile picture
file = document.getElementById('file');
file.addEventListener('change',() => {
    if(file.files.length > 0){
        document.getElementById('upload_pfp').submit();
    }
})

document.addEventListener("DOMContentLoaded", () => {
    handleDarkToggle();
    // initialize all toggles on the page
    checkboxHandler();
});


let checkbox = [
    'reaction-toggle',
    'follow-toggle',
    'post-notif-toggle'
];

// handles checkboxes
async function checkboxHandler() {
    for (let i = 0; i < checkbox.length; i++) {
        const checkboxID = document.getElementById(checkbox[i]);
        const res = await fetch(`/api/settings/${checkbox[i]}`, { method: "POST" });
        const json = await res.json();
        if (!json) {
            console.error(`No data received for ${checkbox[i]}`);
        }
        const data = json[checkbox[i]];
        // set the checkbox state based on the fetched value
        checkboxID.checked = data;
    }
    // add event listeners for each checkbox
    checkbox.forEach(id => {
        const checkboxElement = document.getElementById(id);
        checkboxElement.addEventListener("change", async () => {
            const newValue = checkboxElement.checked; // get the new checked state
            // send the new value to the server
            const res = await fetch(`/api/settings/${id}/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: newValue })
            });
            // catch problem
            if (!res.ok) {
                console.error(`Failed to toggle ${id}:`, res.status);
                checkboxElement.checked = !newValue;
                return;
            }
            const verifyRes = await fetch(`/api/settings/${id}`, { method: "POST" });
            const verifyJson = await verifyRes.json();
            const serverValue = verifyJson[id];
            // verify the server updated correctly

            if (serverValue !== newValue) {
                console.error(`Mismatch for ${id}. UI: ${newValue}, Server: ${serverValue}`);
            } else {
                console.log(`${id} set to ${newValue}`);
            }
        });
    });
}

// Dark mode toggle handler
function handleDarkToggle() {
    const html   = document.documentElement;
    const toggle = document.getElementById("dark-mode-toggle");
    if (!toggle) return;          // no toggle on the page? bail out

    // sync the checkbox to whatever data-theme is right now
    isDark = (html.dataset.theme === "dark");
    console.log("Dark mode is", isDark ? "enabled" : "disabled");
    toggle.checked = isDark;

    // when the user flips the checkbox → set data-theme & persist
    toggle.addEventListener("change", function() {
        const newTheme = isDark ? "light" : "dark";
        html.dataset.theme = newTheme;
        localStorage.setItem("theme", newTheme);
        console.log("theme set to", newTheme);
        isDark = !isDark; 
        toggle.checked = isDark;
  });
}

