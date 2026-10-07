import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Критическая ошибка React:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            color: 'red',
            backgroundColor: '#FFF0F0',
            border: '2px solid red',
            margin: '20px',
            fontFamily: 'monospace',
          }}
        >
          <h2>⚠️ Ошибка выполнения React:</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              padding: '8px 12px',
              background: '#111',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Сбросить кэш и перезагрузить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
