import { createRoot } from 'react-dom/client';
import { Sidepanel } from './components/Sidepanel';
import './sidepanel.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Sidepanel />);
} else {
  console.error('Root container not found');
}