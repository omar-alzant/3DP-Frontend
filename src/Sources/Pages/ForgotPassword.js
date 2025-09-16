import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/supabase/ForgotPwd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`,
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
    <div className="auth-container">
      <h2>نسيت كلمة السر!</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && 
        (<>
          <div>
            <p style={{ color: 'white', display: 'flex', flexDirection: 'Column'}}>{message}
              <Link to="/login" style={{ color: 'white'}}>
                العودة لصفحة تسجيل الدخول
              </Link>
            </p>
          </div>
        </>)
      }

      <form className="auth-card"  onSubmit={handleReset}>
        <input type="email" placeholder="الايميل الخاص بك" value={email} onChange={e => setEmail(e.target.value.replace(/^"|"$/g, ''))} required />
        <button disabled={message} type="submit">ارسال طلب اعادة التعيين</button>
      </form>
      <p style={{color : 'white'}}>
          العودة الى صفحة <Link to="/login">تسجيل الدخول</Link>
      </p>
    </div>
  );
}
