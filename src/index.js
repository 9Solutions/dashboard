import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./utils/globals.js";
import "./utils/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
