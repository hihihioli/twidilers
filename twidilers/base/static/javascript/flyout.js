// While base.js is specifically for base.js 
// (as it has to deal with several flyouts next to each other)
// This is for the function flyOut

// btn supplies the input button id while mnu supplies the content id
function flyOut(mnu) {
    const userMenu = document.getElementById('popupMenu');
    const menu = document.getElementById(mnu);

    if (menu.style.display === 'none') {
        menu.style.display = 'block';
        userMenu.style.display = 'none';
    } else {
        menu.style.display = 'none';
    }

}
