for (let i = 0; i < feed.length; i++) {
    document.write(
        `<div class='pst' id=${feed[i].id}>`
        + `<header>
            <a href="{{ url_for('.profile',username=${feed[i].username}) }}" 
            class="auth-info"
            aria-label="View ${feed[i].username}'s profile">
            <img class="pst-auth-pfp" 
                loading="lazy" 
                src="{{ url_for('.get_pfp', username=${feed[i].username}) }}"
                alt="Profile picture of ${feed[i].displayname}">
            <div class="pst-auths">
                <p class="pst-auth">${feed[i].displayname}</p>
                <p class="pst-disp">@${feed[i].username}</p>              
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


function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

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

const date{{ loop.index0 }} = new Date({{ post.date.timestamp()*1000 }})
    document.getElementById("date{{ loop.index0 }}").innerHTML = date{{ loop.index0 }}.toLocaleString();