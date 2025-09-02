import React from 'react';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
        const email = sessionStorage.getItem("email")?.replace(/^"|"$/g, '');
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/supabase/logout`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'            },
            // If you need to send cookies/session info, include credentials
            body: JSON.stringify({ email, token}), // ✅ stringify
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
      }
      else{
        localStorage.clear();
        sessionStorage.clear(); 
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout error:', err.message);
      alert('Logout failed: ' + err.message);
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
      تسجيل خروج
    </button>
  );
};

export default LogoutButton;
