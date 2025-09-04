// feed.js

// 1) “Global” state
let currentUser  = null;
let currentPage  = 1;
let currentFeedType = 'all';
const POSTS_PER_PAGE = 15;

// 2) DOM refs
const postContainer  = document.getElementById('post-container');
const loadingScreen  = document.getElementById('loading-screen');
const moreButton     = document.getElementById('more');
const lessButton     = document.getElementById('less');
const feedTypeButtons = document.querySelectorAll('.feed-type-btn');
const refreshButton = document.getElementById('refresh');


// 3) Utility: sleep X ms
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// 4) Fetch the current user
async function fetchCurrentUser() {
  try {
    const res = await fetch('/api/currentuser/', { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`CurrentUser failed: ${res.status}`);
    currentUser = await res.json();
    console.log('currentUser →', currentUser);
  } catch(err) {
    console.error('fetchCurrentUser error:', err);
  }
}

// 5) Fetch the feed JSON and render
async function fetchPosts(feedType = currentFeedType) {
    if (!currentUser) {
        console.warn('Cannot fetch feed until currentUser is set');
        return;
    }

    // Show loader
    postContainer.style.display = 'none';
    loadingScreen.style.display = 'flex';

    // Always show at least 200ms spinner
    const minLoad = sleep(200);

    let feedData = null;
    try {
        const url = `/api/feed/${feedType}/${currentPage}`;
        const res = await fetch(url, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
        feedData = await res.json();
        if (!Array.isArray(feedData) || feedData.length === 0) {
          // Show  “no posts” message
          postContainer.innerHTML = `
            <div class="empty-feed">
              <p>There are no posts to display.</p>
            </div>
          `;
          // hide loader & bail out early
          await minLoad;
          loadingScreen.style.display = 'none';
          postContainer.style.display = 'block';
          return;
        }
    } catch(err) {
        console.error('fetchPosts error:', err);
        postContainer.innerHTML = `<p style="color:red">Error loading posts.</p>`;
    }

    await minLoad;

    if (Array.isArray(feedData)) {
        renderPosts(feedData);
    } else {
        postContainer.innerHTML = `<p>No posts to show.</p>`;
    }

    // Hide loader
    loadingScreen.style.display = 'none';
    postContainer.style.display = 'block';

    // Update query string with both page and feed type
    const base = window.location.pathname;
    window.history.replaceState(
        {}, 
        '', 
        `${base}?page=${currentPage}&feed=${feedType}`
    );
}


// Add feed type button handlers
feedTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        feedTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update feed type and reload
        currentFeedType = button.dataset.feed;
        currentPage = 1; // Reset to first page
        fetchPosts(currentFeedType);
    });
});

// selector dropdown field
const feedDropdown = document.getElementById('feed-dropdown');
    if (feedDropdown) {
      // set initial value from currentFeedType
      feedDropdown.value = currentFeedType;

      feedDropdown.addEventListener('change', () => {
        currentFeedType = feedDropdown.value;
        currentPage = 1;

        // mirror the active state on the buttons (in case
        // someone rotates their phone, or screen gets wider)
        feedTypeButtons.forEach(btn => {
          btn.classList.toggle('active',
            btn.dataset.feed === currentFeedType
          );
        });

        fetchPosts(currentFeedType);
      });
    }


// Update refresh button
if (refreshButton) {
    refreshButton.onclick = () => fetchPosts(currentFeedType);
}

// 6) Helper: do they already like this post?
function didLike(post) {
  // the API is returning likes as an array of user *ids*
  return Array.isArray(post.likes)
      && post.likes.includes(currentUser.id);
}


// 7) Build & inject the HTML, then hook up the form-submit interceptor
function renderPosts(posts) {
  postContainer.innerHTML = '';  // clear out old

  // build each post
  for (const post of posts) {
    const author   = post.author;
    const liked    = didLike(post);
    const yourPost = author.id === currentUser.id;
    const btnClass = yourPost
                   ? 'delete-button'
                   : (liked ? 'liked' : 'like-button');

    // choose which hidden‐field to send
    const hiddenField = yourPost
      ? `<input type="hidden" name="delete-post-id" value="${post.id}">`
      : `<input type="hidden" name="like-post-id"   value="${post.id}">`;

    const icon = yourPost
      ? '<i class="fa-solid fa-trash"></i>'
      : '<i class="fa-solid fa-heart"></i>';

    // reaction form
    const reactionsHTML = `
      <form 
         action="/feed" 
         method="post" 
         class="js-reaction-form"
      >
        ${hiddenField}
        <button type="submit" class="pst-react-but ${btnClass}">
          ${icon}
        </button>
      </form>
    `;

    const authorHTML = `
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
    `;

    // full post HTML (tweak as you need)
    const onePost = `
      <div class="pst" id="post-${post.id}">
        <header>
            ${authorHTML}      
        </header>
        <h2 class="pst-title">${post.title || ''}</h2>
        <p class="pst-content">${post.content}</p>
        <div class="pst-date">${new Date(post.date).toLocaleString()}</div>
        <div class="pst-reactions">${reactionsHTML}</div>
      </div>
    `;

    postContainer.insertAdjacentHTML('beforeend', onePost);
  }
}

// 8) Intercept all reaction-form SUBMITs and turn them into XHRs
document.addEventListener('submit', async e => {
  const form = e.target;
  if (!form.classList.contains('js-reaction-form')) return;

  e.preventDefault();  // STOP the full‐page reload

  try {
    const res = await fetch(form.action, {
      method:   form.method.toUpperCase(),
      credentials: 'same-origin', 
      body:     new FormData(form)
    });
    if (!res.ok) {
      console.error('Reaction POST failed:', res.status, await res.text());
      return;
    }
  } catch(err) {
    console.error('XHR reaction error:', err);
  }

  // once server has processed like/delete, reload the JSON feed
  await fetchPosts('all');
});

// 9) Paging controls
function older() { 
    currentPage++; 
    fetchPosts(currentFeedType); 
}

function newer() {
    if (currentPage > 1) {
        currentPage--;
        fetchPosts(currentFeedType);
    }
}

// 10) Kick it all off
window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const feedType = params.get('feed') || 'all';
    currentPage = parseInt(params.get('page')) || 1;
    
    // Set initial active button
    const activeButton = document.querySelector(
        `.feed-type-btn[data-feed="${feedType}"]`
    );
    if (activeButton) {
        activeButton.classList.add('active');
        currentFeedType = feedType;
    }
    if (feedDropdown) {
        feedDropdown.value = currentFeedType;
      }
    
    await fetchCurrentUser();
    await fetchPosts(currentFeedType);
});