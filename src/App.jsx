// src/App.jsx

import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';

function App() {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App; 