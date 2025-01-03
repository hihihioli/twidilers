// Popup for profile and notif menu. Special because there are two popups
const userButton = document.getElementById('usricon-nav');
const userMenu = document.getElementById('popupMenu');
const notifButton = document.getElementById('navbarbell');
const notifMenu = document.getElementById('notif-popup');

notifMenu.style.display = 'none';
userMenu.style.display = 'none';

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
    userMenu.style.display = 'block';
    notifMenu.style.display = 'none';
} else {
    userMenu.style.display = 'none';
}
});

// Notification handler
function clearNotifs() { //The function to clear notifications
    {% if session['username'] %}
        {% set account = findAccount() %}
        data = [ // stores data (not put anywhere. Why are we doing this?)
            {% for notif in account.notifications %}
            [`{{notif['content']}}`,
            "{{notif['author']}}",]
            {% endfor %}
        ]
        fetch("{{url_for('.clear')}}", { // fetches clear function in api.py
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('notif-div-0').innerHTML = '<p>No Notifications</p>'
        })
    {% else %}
        alert('Y no logged in?')
    {% endif %}
    }