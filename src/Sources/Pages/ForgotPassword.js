import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:3001/supabase/ForgotPwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // ✅ correct content type
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
        
      if (data.error) {
        setError(data.error);
      } else {
        setError('');
        setMessage('Check your email to confirm your account!');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && 
        (<>
          <div>
            <p style={{ color: 'green' }}>{message}</p>
              <Link to="/login">
                Redirect to login page.
              </Link>
          </div>
        </>)
      }

      <form onSubmit={handleReset}>
        <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value.replace(/^"|"$/g, ''))} required />
        <button disabled={message} type="submit">Send Reset Email</button>
      </form>
    </div>
  );
}
