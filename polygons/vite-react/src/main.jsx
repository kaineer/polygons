import React from 'react'
import ReactDOM from 'react-dom/client'

// NOTE: that's kinda wrong, but
window.process = {
  arch: 'x64',
};

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
