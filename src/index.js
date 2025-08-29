import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Sources/Style/globale.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <footer className="footer">
    <p>تواصل معنا عبر واتساب أو انستغرام للحصول على عرض سعر أو استشارة مجانية</p>
    <div>
      <p>تم تصميم هذا الموقع من خلال <a href='mailto:alzanatomar.19@gmail.com'> OjZ </a></p>
      <div className='btns-social'>
        <button className='btn-social btn-insta'>
          <img width='25px' height='25px' src='/Images/instagram.png' alt='instagram'/>
        </button>
        <button className='btn-social btn-mail'>
          <img width='25px' height='25px' src='/Images/mail.png' alt='mail'/>
        </button>
        <button className='btn-social btn-mess'>
          <img width='25px' height='25px' src='/Images/messenger.png' alt='messenger'/>
        </button>
        <button className='btn-social btn-whats'>
          <img width='25px' height='25px' src='/Images/whatsapp.png' alt='whatsapp'/>
        </button>
      </div>
      <p style={{display:'flex', alignContent: 'center', direction:'ltr', justifyContent:'center'}}>
        ©{new Date().getFullYear()} 3D-STL · All rights reserved.
      </p>
    </div>
  </footer>
  </React.StrictMode>
);
