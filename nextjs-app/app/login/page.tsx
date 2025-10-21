'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to feed on success
      router.push('/feed');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main>
      <h1 className="heading">Log In</h1>
      
      {error && (
        <div className="flash error">
          <span>{error}</span>
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        id="login_form" 
        name="login_form" 
        className="input_form"
      >
        <input
          type="text"
          className="textbox"
          placeholder="Enter Username"
          id="username"
          name="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          autoComplete="current-password"
          className="textbox"
          placeholder="Enter Password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* TODO: Implement hCaptcha */}
        
        <button 
          id="submit" 
          type="submit" 
          className="submit-h"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <Link href="/send-reset-link" style={{margin:'10px 0 0 0', fontWeight:'bold', width:'fit-content'}}>
          Forgot password?
        </Link>
      </form>

      <div className="separator">
        <span>or</span>
      </div>

      <div className="other-signup">
        {/* TODO: Implement OAuth2 authentication */}
        <button className="gsi-material-button" style={{width:'200px'}} disabled>
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block'}}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">Sign in with Google</span>
          </div>
        </button>

        <button className="gsi-material-button" style={{width:'200px'}} disabled>
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <i className="fa-brands fa-github"></i>
            </div>
            <span className="gsi-material-button-contents">Sign in with Github</span>
          </div>
        </button>
      </div>

      <p style={{marginTop: '20px'}}>
        Don&apos;t have an account? <Link href="/sign-up" style={{fontWeight: 'bold'}}>Sign up</Link>
      </p>
    </main>
  );
}
