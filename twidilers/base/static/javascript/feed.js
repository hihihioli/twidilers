// Fetches JSON for feed
async function fetchPosts() {
    const postContainer = document.getElementById('post-container');
    const postsUrl = "../../api/feed/all";
    const usersUrl = "../../api/users/all";

    postContainer.innerHTML = "<p>Loading...</p>";

    try {
        // Fetch posts
        const postsResponse = await fetch(postsUrl);
        if (!postsResponse.ok) {
            throw new Error(`Posts fetch failed with status: ${postsResponse.status}`);
        }
        const feed = await postsResponse.json();

        // Fetch users
        const usersResponse = await fetch(usersUrl);
        if (!usersResponse.ok) {
            throw new Error(`Users fetch failed with status: ${usersResponse.status}`);
        }
        const users = await usersResponse.json();

        postContainer.innerHTML = ""; // Clear loading message
        renderPosts(feed, users, postContainer);
    } catch (error) {
        console.error(error.message);
        postContainer.innerHTML = "<p>Failed to load posts.</p>";
    }
}


// Renders posts into HTML
function renderPosts(posts, users, container) {
    posts.forEach(post => {
        const author = users.find(user => user.id === post.author_id);

        if (author) {
            const postHTML = `
            <div class='pst' id=${post.id}>
            <header>
                <a href="${author.profile_link}" 
                class="auth-info"
                aria-label="View ${author.displayname}'s profile">
                <img class="pst-auth-pfp" 
                    loading="lazy" 
                    src="${author.photo_url}"
                    alt="Profile picture of ${author.displayname}">
                <div class="pst-auths">
                    <p class="pst-auth">${author.displayname}</p>
                    <p class="pst-disp">@${author.username}</p>              
                </div>
                </a>
            <div class="pst-reactions" id="pst-reactions${post.id}">
                {% if post.author == account %}
                    <form method="post" id="delete-post-form${post.id}">
                        <button type="button" onclick="deletePost(${post.id})" class="pst-react-but" id="delete-post${post.id}" name="delete-post" title="Delete Post">
                            <input type="hidden" name="delete-post-id" value="${post.id}">
                            <i class="fa-solid fa-trash" aria-hidden="true"></i>
                            <span class="visually-hidden" id="thingy" name="thingy">Delete this post</span>
                        </button>
                        <input type="submit" class="visually-hidden" id="delete-post-submit${post.id}">
                    </form>
                {% else %}
                    <form method="post">
                        <button type="submit" class="pst-react-but" id="like-post" name="like-post" title="Like Post">
                            <input type="hidden" name="post-id" value="${post.id}">
                            <i class="fa-solid fa-heart" aria-hidden="true"></i>
                            <span class="visually-hidden">Like this post</span>
                        </button>
                    </form>
                {% endif %}
            </div>
            </header>
            <h2 class='pst-title' id='post-title-${post.id}'>${post.title}</h2>
            <p class='pst-content'>${post.content}</p>
            <p class'pst-date' id='date${post.id}'>${post.date}</p>
            </div>`;
            container.innerHTML += postHTML;
        } else {
            console.warn(`Author not found for post ID: ${post.id}`);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});




function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// delete post animation
/*
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
*/
// not used for date anymore
//const date{{ loop.index0 }} = new Date({{ post.date.timestamp()*1000 }})
    //document.getElementById("date{{ loop.index0 }}").innerHTML = date{{ loop.index0 }}.toLocaleString();