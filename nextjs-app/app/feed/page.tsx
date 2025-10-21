'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Author {
  id: number;
  username: string;
  displayname: string;
  photo_url: string;
  profile_link: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  likes: number[];
  mentions: string[];
  mentions_current_user: boolean;
  author: Author;
}

interface CurrentUser {
  id: number;
  username: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedType, setFeedType] = useState('all');
  const [loading, setLoading] = useState(false);

  const POSTS_PER_PAGE = 15;

  // Fetch current user
  useEffect(() => {
    fetch('/api/currentuser/', { credentials: 'same-origin' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setCurrentUser(data))
      .catch(err => console.error('Failed to fetch current user:', err));
  }, []);

  // Fetch posts
  const fetchPosts = async (type: string = feedType, page: number = currentPage) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feed/${type}/${page}`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
      const data = await res.json();
      setPosts(Array.isArray(data) && data.length > 0 ? data : []);
    } catch (err) {
      console.error('fetchPosts error:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser, feedType, currentPage]);

  const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleLike = async (postId: number) => {
    // TODO: Implement like functionality
    console.log('Like post:', postId);
  };

  const handleDelete = async (postId: number) => {
    // TODO: Implement delete functionality
    console.log('Delete post:', postId);
  };

  const copyToClipboard = (postId: number) => {
    const url = `${window.location.origin}/feed/${postId}`;
    navigator.clipboard.writeText(url)
      .then(() => console.log('Link copied!'))
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <main>
      <div id="topfeed" role="region" aria-label="Feed controls">
        <h1 id="feedtitle">Your feed</h1>
        <div className="feed-controls">
          <select 
            id="feed-dropdown" 
            aria-label="Select feed type"
            value={feedType}
            onChange={(e) => {
              setFeedType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="following">Following</option>
            <option value="liked">Liked</option>
          </select>
        </div>
        <Link href="/post" role="button" className="submit" id="createpost" aria-label="Create a new post" title="Shortcut: N">
          Post
        </Link>
        <button 
          id="refresh" 
          type="button" 
          className="filter"
          onClick={() => fetchPosts()}
        >
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>

      <section aria-label="Posts feed" className="posts-container">
        {loading && (
          <div className="lds-ring" id="loading-screen">
            <div></div><div></div><div></div><div></div>
          </div>
        )}

        <div id="post-container" style={{ display: loading ? 'none' : 'block' }}>
          {posts.length === 0 && !loading ? (
            <div className="empty-feed">
              <p>There are no posts to display.</p>
            </div>
          ) : (
            posts.map(post => {
              const liked = currentUser && post.likes.includes(currentUser.id);
              const isYourPost = currentUser && post.author.id === currentUser.id;
              const mentionClass = post.mentions_current_user ? ' mentioned-you' : '';

              return (
                <div key={post.id} className={`pst${mentionClass}`} id={`post-${post.id}`}>
                  <header>
                    <Link href={post.author.profile_link} className="auth-info">
                      <div className="pst-auth-pfp-container">
                        <img 
                          className="pst-auth-pfp" 
                          loading="lazy" 
                          src={post.author.photo_url}
                          alt={`Profile picture of ${post.author.displayname}`}
                        />
                      </div>
                      <div className="pst-auths">
                        <p className="pst-auth">{post.author.displayname}</p>
                        <p className="pst-disp">@{post.author.username}</p>
                      </div>
                    </Link>
                  </header>
                  <h2 className="pst-title" dangerouslySetInnerHTML={{ __html: post.title || '' }} />
                  <div className="pst-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                  <div className="pst-date">{parseDate(post.date)}</div>
                  <div className="pst-reactions">
                    <span className="pst-like-count">
                      {post.likes.length} like{post.likes.length !== 1 ? 's' : ''}
                    </span>
                    <button 
                      type="button"
                      className={`pst-react-but ${isYourPost ? 'delete-button' : liked ? 'liked' : 'like-button'}`}
                      onClick={() => isYourPost ? handleDelete(post.id) : handleLike(post.id)}
                    >
                      {isYourPost ? (
                        <i className="fa-solid fa-trash"></i>
                      ) : (
                        <i className="fa-solid fa-heart"></i>
                      )}
                    </button>
                  </div>
                  <div 
                    className="pst-share" 
                    onClick={() => copyToClipboard(post.id)}
                    id={`share-${post.id}`}
                  >
                    <i className="fa-solid fa-link"></i>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <div id="bottomfeed" role="region" aria-label="Feed controls">
        <button 
          id="oldest" 
          className="submit" 
          aria-label="Go to oldest page"
          disabled
        >
          &lt;&lt;
        </button>
        <button 
          id="more" 
          className="submit" 
          aria-label="Load older posts"
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={loading}
        >
          &lt;
        </button>
        <span id="middle">{POSTS_PER_PAGE} posts per page.</span>
        <button 
          id="less" 
          className="submit" 
          aria-label="Load newer posts"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          &gt;
        </button>
        <button 
          id="latest" 
          className="submit" 
          aria-label="Go to latest posts"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1 || loading}
        >
          &gt;&gt;
        </button>
      </div>
    </main>
  );
}
