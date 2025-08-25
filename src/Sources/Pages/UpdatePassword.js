import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/supabase/updatePwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // ✅ correct content type
        },
        body: JSON.stringify({ email, password }), // ✅ stringify
      });
  
      // const data = await res.json();

    // const { error } = await supabase.auth.updateUser({ password });
    if (res.error) setError(res.error.message);
    else navigate('/login');
  } catch (err) {
    console.error(err);
    setError('Something went wrong. Please try again.');
  }
};

  return (
    <div>
      <h2>Update Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdate}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}
