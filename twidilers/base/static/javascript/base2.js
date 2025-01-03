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