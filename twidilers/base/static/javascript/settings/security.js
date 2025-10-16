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