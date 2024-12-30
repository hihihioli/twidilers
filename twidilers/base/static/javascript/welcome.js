    // Gets the different pages of the welcome screen
    const welcome1 = document.getElementById('welcome-1');
    const welcome2 = document.getElementById('welcome-2');
    const welcome3 = document.getElementById('welcome-3');
    const welcome4 = document.getElementById('welcome-4');
    const welcome5 = document.getElementById('welcome-5');
    
    // sets the first page to be visible
    welcome1.style.display = 'block';
    welcome2.style.display = 'none';
    welcome3.style.display = 'none';
    welcome4.style.display = 'none';
    welcome5.style.display = 'none';

    // function to change the page
    function nextPage(currentPage) {
        if (currentPage == 1) {
            welcome1.style.display = 'none';
            welcome2.style.display = 'block';
        } else if (currentPage == 2) {
            welcome2.style.display = 'none';
            welcome3.style.display = 'block';
        } else if (currentPage == 3) {
            redirect("{{ url_for('.pages', filename='index.html') }}")
        }
    }
    file = document.getElementById('file');
    file.addEventListener('change',() => {
        if(file.files.length > 0){
            document.getElementById('upload_pfp').submit();
        }
    })