import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../Style/Auth.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    sessionStorage.clear();      // Optional: redirect to login page
    setLoading(true)
    console.log(loading);
    
    const res = await fetch('http://localhost:3001/supabase/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // ✅ correct content type
      },
      body: JSON.stringify({ email, password }), // ✅ stringify
    });
    const data = await res.json();
    const error = data.error;    
    
    if (error) {
      setError(error)
    }
    else {
      sessionStorage.setItem("email", JSON.stringify(data.user.email))
      sessionStorage.setItem("token", data.token)
      setLoading(false)
      navigate('/');
    }
    
    // console.log("token", data.token);
    
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className="auth-card" onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit"> 
        {
        loading ?
        (<>
          Logging In 
          <span className="spinner-small" /> 
        </>)
        :
        "Login"
        }
        </button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
      <p>
        Forgot password? <Link to="/forgot-password">Reset</Link>
      </p>
    </div>
  );
}
