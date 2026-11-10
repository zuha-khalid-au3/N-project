import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Seo from '../../components/Seo.jsx';
import StatusMessage from '../../components/StatusMessage.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login">
      <Seo title="Admin Login" description="Secure admin access" path="/admin/login" />
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <img src="/assets/brand/nemat-gems-jewellery-emblem.png" alt="Nemat Gems and Jewellery" />
        <h1>Admin Login</h1>
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        <label>
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="btn btn--gold" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
