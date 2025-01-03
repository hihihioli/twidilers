// Get all welcome elements in an array
const welcomes = [
    document.getElementById('welcome-0'),
    document.getElementById('welcome-1'),
    document.getElementById('welcome-1'),
    document.getElementById('welcome-2'),
    document.getElementById('welcome-3'),
    document.getElementById('welcome-4'),
    document.getElementById('welcome-5'),
];

// Set the first page to be visible and the rest to be hidden
welcomes.forEach((welcome, index) => {
    welcome.style.display = index === 0 ? 'block' : 'none';
});

// Function to change the page
function nextPage(currentPage) {
    // Hide all pages
    welcomes.forEach((welcome) => (welcome.style.display = 'none'));

    if (currentPage < welcomes.length && currentPage !== 1) {
        // Show the specified page
        welcomes[currentPage].style.display = 'block';
    } else if (currentPage === 1) {
        // If it's the set username page, only show if account is OAuth created
    } else {
        // Redirect if it's beyond the last page
        redirect("{{ url_for('.profile', username=findAccount()) }}");
    }
}
// Uploading profile picture
file = document.getElementById('file');
file.addEventListener('change',() => {
    if(file.files.length > 0){
        document.getElementById('upload_pfp').submit();
    }
})
// hides element
function goAway(e,s) {
    e.style.display = 'none'; // Hides element
    s.style.display = 'block'; // Shows success message
}