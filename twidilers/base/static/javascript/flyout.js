// While base.js is specifically for base.js 
// (as it has to deal with several flyouts next to each other)
// This is for the function flyOut

// btn supplies the input button id while mnu supplies the content id
function flyOut(mnu,btn) {
    const button = document.getElementById(btn);
    const menu = document.getElementById(mnu);

    menu.style.display = 'block';

    button.addEventListener('click', () => {
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
        });  

}
