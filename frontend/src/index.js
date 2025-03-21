import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // This assumes you have a basic CSS file
import App from './App';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { welcome: "Welcome" } },
    es: { translation: { welcome: "Bienvenido" } },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode> // Added the missing closing parenthesis here
);
