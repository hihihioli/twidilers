// This page ougtline sucks. I need perm from backend to rearrange it into a template which makes so much more sense

// This script hides/shows divs if menu bars are clicked.
console.log("I know this page sucks. Will fix when given the go ahead from Oli");
// It fetches the IDs of the divs so it can hide them
const settingsDivs = [
    accountInfo = document.getElementById('acct-dtl-content'),
    security = document.getElementById('security-content'),
    privacy = document.getElementById('privacy-content'),
    notif = document.getElementById('notif-content')
]

const settingsButtons = [
    accountInfoButton = document.getElementById('acct-dtl-btn'),
    securityButton = document.getElementById('security-btn'),
    privacyButton = document.getElementById('privacy-btn'),
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