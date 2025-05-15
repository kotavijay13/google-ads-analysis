
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// This is where we'd typically initialize any global services
// like Google Ads API client libraries

createRoot(document.getElementById("root")!).render(<App />);
