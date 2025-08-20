import { createRoot } from 'react-dom/client'
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
