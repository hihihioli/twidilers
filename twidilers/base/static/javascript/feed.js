// feed.js

// 1) “Global” state
let currentUser  = null;
let currentPage  = 1;
const POSTS_PER_PAGE = 15;

// 2) DOM refs
const postContainer  = document.getElementById('post-container');
const loadingScreen  = document.getElementById('loading-screen');
const moreButton     = document.getElementById('more');
const lessButton     = document.getElementById('less');

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
async function fetchPosts(userFilter = 'all') {
  if (!currentUser) {
    console.warn('Cannot fetch feed until currentUser is set');
    return;
  }

  // Show loader
  postContainer.style.display = 'none';
  loadingScreen.style.display = 'flex';

  // Always show at least 200ms spinner (optional)
  const minLoad = sleep(200);

  let feedData = null;
  try {
    const url = `/api/feed/${userFilter}/${currentPage}`;
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
    feedData = await res.json();
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

  // Update query string
  const base = window.location.pathname;
  window.history.replaceState({}, '', `${base}?page=${currentPage}`);
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
    const yourPost = post.author_id === currentUser.id;
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
function older() { currentPage++; fetchPosts('all'); }
function newer() {
  if (currentPage>1) currentPage--;
  fetchPosts('all');
}
if (moreButton) moreButton.onclick = older;
if (lessButton) lessButton.onclick = newer;

// 10) Kick it all off
window.addEventListener('DOMContentLoaded', async () => {
  await fetchCurrentUser();
  await fetchPosts('all');
});