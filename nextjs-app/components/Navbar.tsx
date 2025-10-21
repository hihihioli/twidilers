'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  user?: {
    username: string;
    notifications?: any[];
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div id="navbar">
        {!user ? (
          <>
            <Link href="/" id="hdr-href">
              <button id="hder-img" aria-label="Home page button">
                <img src="/logo.svg" width="35.56px" height="35.54" alt="Logo" />
              </button>
            </Link>
            <Link href="/about">
              <button>About us</button>
            </Link>
            <Link href="/login">
              <button>Log in</button>
            </Link>
            <Link href="/sign-up">
              <button>Sign up</button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/" id="hdr-href">
              <button id="hder-img" title="Twidilers Home">
                <img src="/logo.svg" width="35.56px" height="35.54" alt="Logo" />
              </button>
            </Link>
            <Link href="/feed">
              <button>Feed</button>
            </Link>
            <button 
              id="navbarbell" 
              title="Notification bell"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="fa-solid fa-bell" style={{width:'auto'}}></i>
              {user.notifications && user.notifications.length > 0 && (
                <div id="notification-count">{user.notifications.length}</div>
              )}
            </button>
            <button 
              id="usricon-nav" 
              title="User icon"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img 
                id="usricon-nav-img" 
                src={`/api/pfp/${user.username}`} 
                alt="User profile"
              />
            </button>
          </>
        )}
      </div>

      {/* Notification Popup */}
      {showNotifications && user && (
        <div className="popup-div popup" id="notif-popup" style={{ display: 'block' }}>
          <div className="notif-div">
            <div id="notif-header">
              <h2>Notifications</h2>
              <button className="submit" id="clear-notifs">
                Clear
              </button>
            </div>
            <div id="notif-div-0">
              {user.notifications && user.notifications.length > 0 ? (
                user.notifications.map((notif: any, idx: number) => (
                  <div key={idx} className="notif-post">
                    <div className="notif-auth">
                      <Link 
                        href={`/profile/${notif.author}`} 
                        className="auth-info-base"
                      >
                        <img 
                          className="pst-auth-pfp" 
                          loading="lazy" 
                          src={`/api/pfp/${notif.author}`}
                          alt={`Profile picture of ${notif.author}`}
                        />
                        <div className="pst-auths-base">
                          <div className="pst-auth">{notif.author}</div>
                          <div className="notif-type">
                            {notif.type === 'reference' && <span>mentioned you in:</span>}
                            {notif.type === 'follow' && <span>posted:</span>}
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-content">
                      {notif.content}
                      {notif.content && notif.content.length > 49 && '...'}
                    </div>
                    <div className="notif-date">
                      {new Date(notif.date * 1000).toLocaleString('en-US', {
                        year: '2-digit',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <span className="no-notifs">No Notifications</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup Menu */}
      {showMenu && user && (
        <div className="popup-div" style={{ display: 'block' }}>
          <div className="popup-menu" id="popupMenu">
            <Link href={`/profile/${user.username}`}>
              <button id="profileBtn">Profile</button>
            </Link>
            <Link href="/settings">
              <button id="settingsBtn">Settings</button>
            </Link>
            <Link href="/logout">
              <button id="logoutBtn">Log Out</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
