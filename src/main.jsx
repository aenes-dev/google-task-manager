import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import GlobalProvider from './context/GlobalProvider.jsx';
import { Toaster } from 'react-hot-toast';



createRoot(document.getElementById('root')).render(
  
  <StrictMode>
  <BrowserRouter>  
  <GlobalProvider>

<Toaster position="top-right" reverseOrder={false} />
    <App />
        </GlobalProvider>
  </BrowserRouter>
  </StrictMode>,
)
