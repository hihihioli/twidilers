// Fetches JSON for feed
async function getData() {
    const postContainer = document.getElementById('post-container');
    const url = "{{ url_for('.get_posts') }}";

    postContainer.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        feed = await response.json();
        console.log(json);
        writePosts(feed);
    } catch (error) {
        console.error(error.message);
        postContainer.innerHTML = "<p>Failed to load posts.</p>";
    }
}

var firstPage = feed.length - 10;
usernames = [];

// finds user based on uuid in json
async function findUsername(uuid) {
    const url = "{{ url_for('get_users') }}";  
    try {
        const response = await fetch(url);  // Fetch data from the endpoint
        const userdata = await response.json();  // Parse response as JSON

        // Iterate through userdata array
        for (let i = 0; i < userdata.length; i++) {
            if (uuid === userdata[i].uuid) {
                userInfo = [
                    userdata[i].username,
                    userdata[i].displayname,
                ]
                return findUserId(userInfo);  // finds other user data and returns it
            }
        }
        return null;  // Return null if user with UUID is not found
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        throw error;  // Throw error for handling at higher level
    }
}

// extension of previous function. different because async
function findUserData(usrinfo) {
    const userName = usrinfo[0];
    const displayName = usrinfo[1];
    const userPFP = `{{ url_for('.get_pfp', username=${username})}}`
    const userPage = `{{ url_for('.profile', username=${username})}}`
    
    var everything = [
        username = userName,
        displayname = displayName,
        userpfp = userPFP,
        userpage = userPage,
    ]
    return everything;
}

// Writes post 
function writePosts(feed) {
    for (let i = feed.length; i < firstPage; i-=1) {
        var authorData = findUsername(feed[i].uuid)
        document.write(
            `<div class='pst' id=${feed[i].id}>`
            + `<header>
                <a href="${authorData.userpage}" 
                class="auth-info"
                aria-label="View ${authorData.displayname}'s profile">
                <img class="pst-auth-pfp" 
                    loading="lazy" 
                    src="${authorData.userpfp}"
                    alt="Profile picture of ${authorData.username}">
                <div class="pst-auths">
                    <p class="pst-auth">${authorData.displayname}</p>
                    <p class="pst-disp">@${authorData.username}</p>              
                </div>
                </a>`
            + `<div class="pst-reactions" id="pst-reactions${i}">
                {% if post.author == account %}
                    <form method="post" id="delete-post-form${i}">
                        <button type="button" onclick="deletePost(${i})" class="pst-react-but" id="delete-post${i}" name="delete-post" title="Delete Post">
                            <input type="hidden" name="delete-post-id" value="${i}">
                            <i class="fa-solid fa-trash" aria-hidden="true"></i>
                            <span class="visually-hidden" id="thingy" name="thingy">Delete this post</span>
                        </button>
                        <input type="submit" class="visually-hidden" id="delete-post-submit${i}">
                    </form>
                {% else %}
                    <form method="post">
                        <button type="submit" class="pst-react-but" id="like-post" name="like-post" title="Like Post">
                            <input type="hidden" name="post-id" value="${i}">
                            <i class="fa-solid fa-heart" aria-hidden="true"></i>
                            <span class="visually-hidden">Like this post</span>
                        </button>
                    </form>
                {% endif %}
            </div>
            </header>`
            + `<h2 class='pst-title' id='post-title-${i}'>${feed[i].title}</h2>`
            + `<p class='pst-content'>${feed[i].content}</p>`
            + `<p class'pst-date' id='date${i}'>${feed[i].date}</p>`
            + `</div>`
        );
    }
}


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// delete post animation
async function deletePost(postid) {
    var deletePostButton = document.getElementById(`delete-post${postid}`);
    var deletePostContainer = document.getElementById(`pst-reactions${postid}`);
    var form = document.getElementById(`delete-post-form${postid}`);
    var postContainer = document.getElementById(`post${postid}`);
    var postHeight = postContainer.clientHeight;

    // Start with expanding the trashcan to cover the entire post container
    deletePostContainer.style.width = "100%";
    form.style.width = "100%";
    deletePostContainer.style.height = "100%";
    form.style.height = "100%";
    deletePostContainer.style.top = "0";
    deletePostContainer.style.right = "0";

    deletePostButton.style.transition = "all 0.5s ease";
    deletePostButton.style.width = "100%";
    deletePostButton.style.fontSize = "1.5em";

    await sleep(500);

    // Expand the trashcan vertically
    deletePostButton.style.height = "100%";

    await sleep(500);
    postContainer.style.overflow = "hidden";
    form.style.overflow = "hidden";
    var i = 100;
    while (i>0) {
        i = i-1;
        var h = postHeight / 100 * i - 20;
        form.style.height = `${h}%`;
        postContainer.style.height = `${h}%`;
        await sleep(0.1);
    }
    // Collapse the post container until it disappears

    // Submit the form
    console.log("Attempting to submit the form...");
    form.submit();
}

// not used for date anymore
//const date{{ loop.index0 }} = new Date({{ post.date.timestamp()*1000 }})
    //document.getElementById("date{{ loop.index0 }}").innerHTML = date{{ loop.index0 }}.toLocaleString();