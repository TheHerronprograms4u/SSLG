import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareHeart, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="container fade-in">
      <div style={{ textAlign: 'center' }}>
        <MessageSquareHeart size={64} color="var(--accent-color)" style={{ marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.025em' }}>
          Your voice matters.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Help us build a better student experience. Share your thoughts, ideas, and concerns directly with your SSLG.
        </p>
        <Link to="/feedback" className="button" style={{ fontSize: '1.2rem', padding: '16px 32px' }}>
          Share Your Voice <ArrowRight size={20} />
        </Link>
      </div>
      
      <div style={{ position: 'fixed', bottom: '2rem', left: '0', right: '0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.5 }}>SSLG Officer Access</Link>
      </div>
    </div>
  );
};

export default Home;
