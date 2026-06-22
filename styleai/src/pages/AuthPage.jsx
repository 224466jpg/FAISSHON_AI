import { useState } from 'react';
import { loginUser, registerUser } from '../services/fashionApi';

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(mode === 'login' ? 'Signing you in...' : 'Creating your account...');

    try {
      const user = mode === 'login'
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      localStorage.setItem('fashion-ai-user', JSON.stringify(user));
      setStatus(mode === 'login' ? 'Login successful.' : 'Account created successfully.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel glass-card">
        <div className="segmented-control">
          <button
            className={mode === 'login' ? 'selected' : ''}
            type="button"
            onClick={() => {
              setMode('login');
              setStatus('');
            }}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'selected' : ''}
            type="button"
            onClick={() => {
              setMode('register');
              setStatus('');
            }}
          >
            Register
          </button>
        </div>
        <p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>
        <h1>{mode === 'login' ? 'Continue your style journey' : 'Start your AI closet'}</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(event) => updateForm('name', event.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => updateForm('email', event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => updateForm('password', event.target.value)}
            minLength="4"
            required
          />
          <button className="primary-button full-width" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          {status && <p className="status-text">{status}</p>}
        </form>
      </section>
    </main>
  );
}

export default AuthPage;
