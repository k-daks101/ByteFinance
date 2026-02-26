import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Example Dashboard component (protected)
function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name || user?.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Example Home component
function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to ByteFinance</h1>
      {isAuthenticated ? (
        <div>
          <p>Hello, {user?.name}!</p>
          <Link to="/dashboard">Go to Dashboard</Link>
        </div>
      ) : (
        <div>
          <p>Please login or register to continue</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
            <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
