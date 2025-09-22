import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Sources/Style/globale.css';
import { ReactComponent as Logo } from './logo.svg';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
      
  </React.StrictMode>
);
