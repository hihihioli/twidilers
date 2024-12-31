// Get all welcome elements in an array
const welcomes = [
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

    if (currentPage < welcomes.length) {
        // Show the specified page
        welcomes[currentPage].style.display = 'block';
    } else {
        // Redirect if it's beyond the last page
        redirect("{{ url_for('.pages', filename='index.html') }}");
    }
}
    file = document.getElementById('file');
    file.addEventListener('change',() => {
        if(file.files.length > 0){
            document.getElementById('upload_pfp').submit();
        }
    })
    function goAway(e) {
        e.style.display = 'none';
    }