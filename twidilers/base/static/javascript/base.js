// Popup for profile and notif menu. Special because there are two popups
const userButton = document.getElementById('usricon-nav');
const userMenu = document.getElementById('popupMenu');
const notifButton = document.getElementById('navbarbell');
const notifMenu = document.getElementById('notif-popup');
const filterMenu = document.getElementById('filter-form');
const locationthing = document.getElementById('location');



notifMenu.style.display = 'none';
userMenu.style.display = 'none';
let small;
window.addEventListener('resize', animate);
window.onload = function () {
    locationthing.value = window.location;
    console.log(window.location);
    animate();

};
function animate() {
if (window.innerWidth <= 530) {
    small = true;
    userMenu.style.animationName = '';
} else {
    small = false;
}
}
notifButton.addEventListener('click', () => {
if (notifMenu.style.display === 'none') {
    notifMenu.style.display = 'flex';
    if (userMenu.style.display !== 'none')
    toggleMenu();
} else {
    notifMenu.style.display = 'none';
}
});  

userButton.addEventListener('click', toggleMenu)
    
function toggleMenu () {
if (userMenu.style.display === 'none') { // Display usermenu
userMenu.style.display = 'flex';
    if (!small) {
    userMenu.style.animationName = "shrink"
    userMenu.style.animationDuration = '0.35s'
    userMenu.style.animationDirection = 'reverse'
    userMenu.style.animationFillMode = 'forwards';

    notifMenu.style.display = 'none';
    userMenu.addEventListener('animationend', function handler1() {
            userMenu.style.animationName = '';
            userMenu.removeEventListener('animationend', handler1);
        });
    }
} else {
    if (!small) {
    userMenu.style.animationName = 'shrink';
    userMenu.style.animationDuration = '0.35s'; //Hide usermenu
    userMenu.style.animationDirection = 'normal'
    userMenu.style.animationFillMode = 'forwards';
    userMenu.addEventListener('animationend', function handler2() {
            userMenu.style.display = 'none';
            userMenu.style.animationName = '';
            userMenu.removeEventListener('animationend', handler2);
        });
    } else {
        userMenu.style.display = 'none';
    }
}
};

