let amountOfPostsRendered = 0;

async function fetchPosts() {
    const postContainer = document.getElementById('post-container');
    const postsUrl = "../../api/feed/all";
    const usersUrl = "../../api/users/all";

    try {
        // Fetch posts
        const postsResponse = await fetch(postsUrl);
        if (!postsResponse.ok) {
            throw new Error(`Posts fetch failed with status: ${postsResponse.status}`);
        }
        const feed = await postsResponse.json();
        if (amountOfPostsRendered === feed.length) {
            return; // Doesn't reload if there aren't any new posts
        }
        // Fetch users
        const usersResponse = await fetch(usersUrl);
        if (!usersResponse.ok) {
            throw new Error(`Users fetch failed with status: ${usersResponse.status}`);
        }
        const users = await usersResponse.json();

        const newPosts = feed.slice(amountOfPostsRendered);
        if (newPosts.length > 0) {
            renderPosts(newPosts, users, postContainer); // Render only new posts
            amountOfPostsRendered = feed.length; // Update the counter
        }
        
        postContainer.innerHTML = ""; // Clear loading message
        renderPosts(feed, users, postContainer);
        amountOfPostsRendered = feed.length;
    } catch (error) {
        console.error(error.message);
        postContainer.innerHTML = "<p>Failed to load posts.</p>";
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