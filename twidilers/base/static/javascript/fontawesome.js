// Adds fontawesome styles to the page once everything has loaded
window.addEventListener('load', function() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = "{{ url_for('.static', filename='styles/fontawesome.css') }}";
    document.body.appendChild(link);
});