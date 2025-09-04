// Popup for profile and notif menu. Special because there are two popups
const userButton = document.getElementById('usricon-nav');
const userMenu = document.getElementById('popupMenu');
const notifButton = document.getElementById('navbarbell');
const notifMenu = document.getElementById('notif-popup');
const filterMenu = document.getElementById('filter-form');
const locationthing = document.getElementById('location');



notifMenu.style.display = 'none';
userMenu.style.display = 'none';

// Expands notif page if it's clicked
notifButton.addEventListener('click', () => {
if (notifMenu.style.display === 'none') {
    notifMenu.style.display = 'flex';
    userMenu.style.display = 'none';
} else {
    notifMenu.style.display = 'none';
}
});  

userButton.addEventListener('click', () => {
if (userMenu.style.display === 'none') {
    userMenu.style.display = 'flex';
    notifMenu.style.display = 'none';
    filterMenu.style.display = 'none';
} else {
    userMenu.style.display = 'none';
}
});

// Handles character count
document.addEventListener('DOMContentLoaded', function(){
// 1) find all textareas that need counting
var boxes = document.querySelectorAll('textarea.js-countable');

if (boxes) {
    boxes.forEach(function(txt){
        var max    = parseInt(txt.getAttribute('maxlength'), 10) || 0;
        var counter= document.getElementById(txt.id + '-count');
        if (!counter) return;  // no counter found, skip

        // update function
        function update(){
        var used = txt.value.length;
        counter.textContent = used + " / " + max;
        counter.classList.toggle('warning', used > max);
        }

        // init + hook into future changes
        update();
        txt.addEventListener('input', update);
    });
}});
