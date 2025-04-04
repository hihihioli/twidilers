function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// Sets current page based on Browser URL.
let currentPage = (function() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1; // Default to page 1
})();


let loadedPages = [];

async function fetchPosts(user) {
    const postContainer = document.getElementById('post-container');
    const loadingScreen = document.getElementById('loading-screen');
    const postsUrl = `../../api/feed/${user}/${currentPage}`;

    // Show loading screen
    postContainer.style.display = "none"; // Hide posts temporarily
    loadingScreen.style.display = "flex";

    // Ensure at least 0.2s loading
    const minimumLoadingTime = sleep(200);

    try {
        // Fetch posts
        const postsResponse = await fetch(postsUrl);
        if (!postsResponse.ok) {
            throw new Error(`Posts fetch failed with status: ${postsResponse.status}`);
        }
        const feed = await postsResponse.json(); // Get the JSON from the response

        // Check if the feed is empty
        if (feed.length === 0) {
            postContainer.innerHTML = "<p>No posts.</p>";
            loadedPages = [];
        } else if (JSON.stringify(loadedPages) === JSON.stringify(feed)) {
            console.log("No new posts to load.");
            return; // If the feed is the same as the loaded pages, return
        } else {
            postContainer.innerHTML = ""; // Clear existing posts
            loadedPages = feed; // Update loadedPages with the latest feed
            await renderPosts(feed, postContainer); //  Render posts
        }
    } catch (error) {
        console.error(error.message);
        postContainer.innerHTML = "<p>Failed to load posts.</p>";
    } finally {
        // Wait for minimum loading time before hiding the loading screen
        await minimumLoadingTime;
        const baseUrl = window.location.pathname;
        window.history.pushState({page: currentPage}, '', `${baseUrl}?page=${currentPage}`);      
        loadingScreen.style.display = "none"; // Hide loading animation
        postContainer.style.display = "block"; // Show posts
    }
}

// Establishes currentUser and fetches it upon page initialization
var currentUser = "";
async function fetchCurrentUser() {
    try {
        const response = await fetch('../../api/currentuser/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const user = await response.json();
        currentUser = user;
        return user;
    } catch (error) {
        console.error('Failed to fetch current user:', error);
    }
}


async function didLike(postInfo) {
    try {
        const response = postInfo;
        if (response.likes.includes(currentUser.username)) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Failed to check if post is liked:', error);
    }
}

// Renders posts into HTML
async function renderPosts(posts, container) {
    for (const post of posts) {
        // We are going to set a baseline reactions
        let react = "";
        var reactions = `
            <form method="post">
                <button type="submit" class="pst-like-but ${react}" id=like-post-${post.id} name="delete-post" title="Delete Post">
                    <input type="hidden" name="like-post-id" value="${post.id}">
                    <i class="fa-solid fa-heart" aria-hidden="true"></i>
                    <span class="visually-hidden">Like this post</span>
                </button>
            </form>
        `;
        if (didLike(post)) {
            react = "liked"; // set reaction to liked
        }

        if (post.author_url) {  // Check if author_url exists
            try {
                let author;

                // Check if the author data is already cached in sessionStorage
                const cachedAuthor = sessionStorage.getItem(post.author_url);
                if (cachedAuthor) {
                    author = JSON.parse(cachedAuthor); // Parse the cached JSON to an object
                } else {
                    const response = await fetch(post.author_url);  // Fetch author data using the URL
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    author = await response.json();  // Parse the response as JSON
                    sessionStorage.setItem(post.author_url, JSON.stringify(author)); // Cache the author data in sessionStorage
                }

                // If the poster is the logged in user, replace like  button with delete button
                if (currentUser.username === author.username) {
                    reactions = `
                        <form method="post">
                            <button type="submit" class="pst-react-but" id="delete-post" name="delete-post" title="Delete Post">
                                <input type="hidden" name="delete-post-id" value="${post.id}">
                                <i class="fa-solid fa-trash" aria-hidden="true"></i>
                                <span class="visually-hidden">Delete this post</span>
                            </button>
                        </form>
                    `;
                }

                // Construct the HTML for the post
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
                        <div class="pst-reactions">
                            ${reactions}
                        </div>
                    </header>
                    <h2 class='pst-title' id='post-title-${post.id}'>${post.title}</h2>  <!-- Fallback for empty title -->
                    <p class='pst-content'>${post.content}</p>
                    <div class='pst-date' id='date${post.id}'>${post.date}</div>
                </div>`;
                
                container.innerHTML += postHTML;  // Append the constructed HTML to the container

            } catch (error) {
                console.error(`Failed to fetch author data for post ID: ${post.id}`, error);
            }
        } else {
            console.warn(`Author URL not found for post ID: ${post.id}`);
        }
    }
}
const moreButton = document.getElementById('more'); //olderposts
const lessButton = document.getElementById('less'); //newerposts
// Go to older pages
function oldPosts(user) {
    currentPage++;
    fetchPosts(user);
}


// go to newer pages
function newPosts(user) {
    if (currentPage === 1) {
        console.log("Already at the newest posts.");
        return 0;
    }
    currentPage -= 1;
    fetchPosts(user);
}

function latestPosts(user) {
    currentPage = 1; // Reset to the first page
    fetchPosts(user);
    lessButton.classList.remove('disabled'); // Enable the "Newer Posts" button
    console.log("Reset to the latest posts.");
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchCurrentUser();
    fetchPosts('all');
});
        
document.addEventListener('keypress', openKeyPressHandler);

function openKeyPressHandler(event) {
    if (event.key === 'n') {
        window.location.href = "/post"; // opens new post page
    } else if (event.key === 'r') {
        fetchPosts('all', currentPage); // simulates refresh
    }
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