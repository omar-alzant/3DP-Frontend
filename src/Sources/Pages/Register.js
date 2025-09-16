import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../Style/Auth.css";
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { registerUser } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();

    const result = await registerUser(email, password);

    if (result.success) {
      setError('');
      setMessage(result.message);
    } else {
      setMessage('');
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <h2>إنشاء ايميل</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      <form className="auth-card" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="الايميل"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة السر"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">إنشاء</button>
      </form>

      <p style={{color : 'white'}}>
        عندك ايميل؟ <Link to="/login">تسجيل دخول </Link>
      </p>
    </div>
  );
}
