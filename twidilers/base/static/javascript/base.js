// Popup for profile and notif menu
const userButton = document.getElementById('usricon-nav');
const userMenu = document.getElementById('popupMenu');
const notifButton = document.getElementById('navbarbell');
const notifMenu = document.getElementById('notif-popup');

notifMenu.style.display = 'none';
userMenu.style.display = 'none';

notifButton.addEventListener('click', () => {
if (notifMenu.style.display === 'none') {
    notifMenu.style.display = 'flex';
    console.log("I'm showing the menu!");
    userMenu.style.display = 'none';
} else {
    notifMenu.style.display = 'none';
    console.log("I'm hiding the menu!");
}
});  

userButton.addEventListener('click', () => {
if (userMenu.style.display === 'none') {
    userMenu.style.display = 'block';
    console.log("I'm showing the menu!");
    notifMenu.style.display = 'none';
} else {
    userMenu.style.display = 'none';
    console.log("I'm hiding the menu!");
}
});