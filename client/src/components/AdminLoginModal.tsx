import React, { useState } from 'react';
import { Lock, Key, X, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast
}) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Default admin password or check custom pass
      if (password === 'sslg2026' || password === 'admin' || password === 'sslgadmin') {
        localStorage.setItem('sslg_admin_auth', 'true');
        onSuccess();
        onShowToast('Administrator access granted.');
        setPassword('');
        setError('');
        onClose();
      } else {
        setError('Invalid administrator password. Access denied.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div
        className="card"
        style={{
          maxWidth: '420px',
          width: '90%',
          margin: 'auto',
          position: 'relative',
          padding: '2rem',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(90, 10, 58, 0.25)',
          border: '1px solid #fce4ec'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#fce4ec',
              color: 'var(--accent-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}
          >
            <Lock size={26} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.3rem' }}>
            Admin Authentication
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Enter official SSLG administrator passcode to access publishing tools.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}
            >
              Administrator Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                autoFocus
                required
              />
              <Key
                size={18}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="button"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>
      </div>
    </div>
  );
};
