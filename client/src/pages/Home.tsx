import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/hero.jpg'; // Using the new hero.jpg logo

const Home: React.FC = () => {
  return (
    <div className="container fade-in">
      <div style={{ textAlign: 'center' }}>
        <img src={logo} alt="SSLG Logo" className="logo-img" style={{ width: '180px', marginBottom: '1.5rem', mixBlendMode: 'multiply' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.025em', color: 'white' }}>
          Your voice matters.
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          Help us build a better student experience. Share your thoughts, ideas, and concerns directly with Gubat National High School SSLG.
        </p>
        <Link to="/feedback" className="button" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
          Share Your Voice <ArrowRight size={20} />
        </Link>
      </div>
      
      <div style={{ position: 'fixed', bottom: '2rem', left: '0', right: '0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.6, fontWeight: 500 }}>SSLG Officer Access</Link>
      </div>
    </div>
  );
};

export default Home;
