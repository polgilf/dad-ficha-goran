import {createRoot} from 'react-dom/client';
import {Provider} from './store';
import App from './App';
import './style.css';
createRoot(document.getElementById('root')!).render(<Provider><App/></Provider>);
