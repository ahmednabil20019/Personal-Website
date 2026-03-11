import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove initial HTML loading screen after React mounts
const removeInitialLoader = () => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
        loader.style.transition = 'opacity 0.5s ease-out';
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
};

createRoot(document.getElementById("root")!).render(<App />);

// Remove loader after a small delay to ensure smooth transition
setTimeout(removeInitialLoader, 100);
