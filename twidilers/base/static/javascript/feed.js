function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
let currentPage = 1;
let loadedPages = []

async function fetchPosts(user) {
    const postContainer = document.getElementById('post-container');
    const loadingScreen = document.getElementById('loading-screen');
    const postsUrl = `../../api/feed/${user}/${currentPage}`;
    const usersUrl = "../../api/users/all";

    // Show loading screen
    postContainer.style.display = "none"; // Hide posts temporarily
    loadingScreen.style.display = "flex";
    const minimumLoadingTime = sleep(200); // Ensure at least 0.7s loading

    try {
        // Fetch posts and users simultaneously
        const [postsResponse, usersResponse] = await Promise.all([fetch(postsUrl), fetch(usersUrl)]);
        
        if (!postsResponse.ok) {
            throw new Error(`Posts fetch failed with status: ${postsResponse.status}`);
        }
        if (!usersResponse.ok) {
            throw new Error(`Users fetch failed with status: ${usersResponse.status}`);
        }

        const [feed, users] = await Promise.all([postsResponse.json(), usersResponse.json()]);

        if (loadedPages === feed) {
            console.log("No new posts to load.");
            return;
        }

        if (feed.length === 0) {
            postContainer.innerHTML = "<p>No posts.</p>";
            loadedPages = [];
        } else {
            postContainer.innerHTML = ""
            loadedPages = feed;
            renderPosts(feed, users, postContainer);
        }
    } catch (error) {
        console.error(error.message);
        postContainer.innerHTML = "<p>Failed to load posts.</p>";
    } finally {
        // Wait for minimum loading time before hiding the loading screen
        await minimumLoadingTime;
        loadingScreen.style.display = "none"; // Hide loading animation
        postContainer.style.display = "block"; // Show posts
    }
}


// Renders posts into HTML
function renderPosts(posts, users, container, amount) {
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
                </header>
                <h2 class='pst-title' id='post-title-${post.id}'>${post.title}</h2>
                    <p class='pst-content'>${post.content}</p>
                    <div class'pst-date' id='date${post.id}'>${post.date}</div>
            </div>`;
            container.innerHTML += postHTML;
        } else {
            console.warn(`Author not found for post ID: ${post.id}`);
        }
    });
}

function oldPosts(user) {
    currentPage++;
    fetchPosts(user);
}

function newPosts(user) {
    currentPage -= 1;
    fetchPosts(user);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts('all');
});
        


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