import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../Style/Auth.css";
import { ReactComponent as Logo } from '../../logo.svg';
import ReCAPTCHA from "react-google-recaptcha";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoutFromOtherDevicesBtn, setLogoutFromOtherDevicesBtn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(""); // <-- define state
  const [recaptchaValid, setRecaptchaValid] = useState(false);

  const navigate = useNavigate();
  const handleRecaptchaChange = (token) => {
    // token === null means no token
    setRecaptchaToken(token);
    setRecaptchaValid(!!token);
    setError(""); // clear previous messages
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
    setRecaptchaValid(false);
    setError("انتهت صلاحية reCAPTCHA. الرجاء إعادة التحقق.");
  };

  const handleRecaptchaError = () => {
    setRecaptchaToken(null);
    setRecaptchaValid(false);
    setError("حصل خطأ في reCAPTCHA. حاول مرة أخرى.");
    console.log("ERRRRRRRRORRR")
  };

  const handleLogoutClick = () => {
    setShowForm(true);
    if (!recaptchaToken) {
      return;
    }

    
  }

  const handleConfirmLogout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/supabase/logoutAlldevices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      const data = await res.json();

      if (data.ok) {
        setError(null);
        setRecaptchaToken(null);
        setRecaptchaValid(false);
        setLogoutFromOtherDevicesBtn(false)
        window.location.reload();
        return;
      } 

      setShowForm(false);

    } catch (err) {
      console.error(err);
      setError('حدث خطأ ما');
      setRecaptchaToken(null);
      setRecaptchaValid(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    sessionStorage.clear();      // Optional: redirect to login page
    setLoading(true)
    
    const res = await fetch(`${process.env.REACT_APP_API_URL}/supabase/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }), // ✅ stringify
    });
    const data = await res.json();
    const error = data.error;    
    
    if (error) {
      if(error.startsWith('User is already logged in on another device')) 
        setLogoutFromOtherDevicesBtn(true)
      else setLogoutFromOtherDevicesBtn(false)
      setError(error)
      setLoading(false)
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
      {/* <h2>تسجيل الدخول إلى</h2> */}
      {/* <img src='/logo.jpg' alt='logo' className='login-svg' /> */}
      <Logo className="logo-svg" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {logoutFromOtherDevicesBtn &&
        <>
          <button className="logout-btn" onClick={handleLogoutClick}>
            تسجيل الخروج من جميع الأجهزة!
          </button>

          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>أدخل البريد الإلكتروني وكلمة المرور لتسجيل الخروج من جميع الأجهزة</h3>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                          {/* reCAPTCHA widget */}
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  onExpired={handleRecaptchaExpired}
                  onErrored={handleRecaptchaError}
  
               />
                <div className="modal-buttons">
                  <button className="confirm-btn" 
                          disabled={!recaptchaValid}
                          style={{ display: recaptchaValid ? "inline-block" : "none" }}
                          aria-disabled={!recaptchaValid}
                          onClick={handleConfirmLogout}
                  >
                    تأكيد
                  </button>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
        }
      <form className="auth-card" onSubmit={handleLogin}>
        <input type="email" placeholder="الايميل" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit"> 
        {
        loading ?
        (<>
           يتم تسجل الدخول 
          <span className="spinner-small" /> 
        </>)
        :
        "تسجيل الدخول"
        }
        </button>
      </form>
      <p >
        لا يوجد عندك حساب؟ <Link to="/register">إنشاء حساب</Link>
      </p>
      <p >
        نسيت كلمة السر؟ <Link to="/forgot-password">إعادة تعيين </Link>
      </p>
    </div>
  );
}
