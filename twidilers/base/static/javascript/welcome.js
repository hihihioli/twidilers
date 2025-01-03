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