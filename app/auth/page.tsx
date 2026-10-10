'use client';

import { useState, type FormEvent } from 'react';
import { authenticateEmailPassword, firebaseConfigured } from '../../lib/firebase';

const logo = 'https://i.postimg.cc/6pLt0sn3/file-000000006e348210b7a8c70bc4ed899d.png';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function errorMessage(error: unknown) {
    const value = error as { code?: string; message?: string };
    switch (value?.code) {
      case 'auth/configuration-not-found':
        return 'Firebase Authentication is not initialized for this project, or the web config points to a different project. In Firebase Console, open kitcity-efd96, set up Authentication, and enable Email/Password.';
      case 'auth/email-already-in-use':
        return 'An account already uses this email. Choose Sign in instead.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email or password is incorrect.';
      case 'auth/weak-password':
        return 'Choose a password with at least 8 characters.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a little and try again.';
      default:
        return value?.message || 'Authentication failed. Please try again.';
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setMessage('');

    if (!firebaseConfigured) {
      setMessage('Firebase web configuration is missing from this deployment.');
      return;
    }
    const cleanUsername = username.trim();
    if (!/^[A-Za-z0-9_]{3,20}$/.test(cleanUsername)) {
      setMessage('Username must be 3–20 letters, numbers, or underscores.');
      return;
    }
    if (password.length < 8) {
      setMessage('Password must contain at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      const deviceKey = 'kitcity_install_id';
      let deviceId = localStorage.getItem(deviceKey);
      if (!deviceId) {
        deviceId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : 'kc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
        localStorage.setItem(deviceKey, deviceId);
      }

      await authenticateEmailPassword({
        mode,
        email: email.trim().toLowerCase(),
        password,
        username: cleanUsername,
        deviceId,
        location: null,
      });
      localStorage.setItem('kitcity_player_name', cleanUsername);
      window.location.href = '/?enter=1';
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="authPage">
      <section className="auth-shell" aria-labelledby="authHeading">
        <button className="auth-back" type="button" onClick={() => { window.location.href = '/'; }}>
          <span aria-hidden="true">←</span> Back to KitCity
        </button>

        <div className="auth-brand">
          <img src={logo} alt="KitCity" />
          <div>
            <b>KitCity</b>
            <small>Learn Web3 on the streets</small>
          </div>
        </div>

        <header className="auth-heading">
          <h1 id="authHeading">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p>{mode === 'signin' ? 'Sign in to continue your journey through KitCity.' : 'Create your player account and start your KitCity journey.'}</p>
        </header>

        <form className="auth-panel" onSubmit={submit}>
          <div className="auth-tabs" role="group" aria-label="Authentication type">
            <button type="button" aria-pressed={mode === 'signin'} onClick={() => { setMode('signin'); setMessage(''); }}>Sign in</button>
            <button type="button" aria-pressed={mode === 'signup'} onClick={() => { setMode('signup'); setMessage(''); }}>Create account</button>
          </div>

          <label className="auth-field">
            <span>EMAIL ADDRESS</span>
            <input type="email" name="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} />
          </label>

          <label className="auth-field">
            <span>PLAYER USERNAME</span>
            <input type="text" name="username" autoComplete="nickname" autoCapitalize="none" spellCheck={false} placeholder="e.g. KitExplorer" minLength={3} maxLength={20} required value={username} onChange={event => setUsername(event.target.value)} />
          </label>

          <label className="auth-field">
            <span>PASSWORD</span>
            <input type="password" name="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="At least 8 characters" minLength={8} maxLength={128} required value={password} onChange={event => setPassword(event.target.value)} />
          </label>

          {message ? <p className="auth-message" role="alert" aria-live="polite">{message}</p> : null}

          <button className="btn auth-submit" type="submit" disabled={busy}>
            {busy ? 'Securing your account…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">Your account saves your player profile and KitCity progress.</p>
      </section>
    </main>
  );
}
