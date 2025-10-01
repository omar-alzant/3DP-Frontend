import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../../logo-mini.svg';
import '../Style/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className='footer-section-1'>
        <div className='footer-part-social'>
          <p>تابعنا </p>
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
        </div>

        <div className='footer-part'>
          <p>تواصل معنا</p>
          <div className="sub-community">
            <p>
              📧 info@3dstl.com
            </p>
            <p>
              📱 +961 71 123 456
            </p>
            <p>
              📍 طرابلس - لبنان
            </p>
          </div>
        </div>

        <div className='footer-part'>
          <Link to="/" className="nav-link">الرئيسية</Link>
          <Link to="/" className="nav-link">خدماتنا</Link>
          <Link to="/" className="nav-link">أسئلة شائعة</Link>
        </div>

        <div className='footer-part'>
          <Logo className="logo-svg" />
        </div>
      </div>

      <div className='footer-section-2'>
        <div className='footer-part'>
          سياسة الخصوصية | جميع الحقوق محفوظة
        </div>
        <div className='footer-part'>
          © 2025 3D-STL · All rights reserved
        </div>
      </div>

      <p>تواصل معنا عبر واتساب أو انستغرام للحصول على عرض سعر أو استشارة مجانية</p>
      <div>
        <p>
          تم تصميم هذا الموقع من خلال
          <a href='mailto:alzanatomar.19@gmail.com'> OjZ </a>
        </p>
      </div>
    </footer>
  );
}
