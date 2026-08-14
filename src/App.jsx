import { createRoot } from 'react-dom/client';
import { Dropzone } from './components/Dropzone';
import './App.css';

function App() {
  return (
    <main className="app">
      <h1>Dropzone</h1>
      <Dropzone />
    </main>
  );
}

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<App />);
}
