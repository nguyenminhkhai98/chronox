import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout';
import Home from './pages/Home';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import './styles/global.scss';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ChronoX App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong with ChronoX</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/create" element={<CreateEvent />} />
                <Route path="/events/:id" element={<EventDetail />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('App initialization error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>ChronoX Failed to Load</h1>
        <p>Check the console for more details</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
}

export default App;
