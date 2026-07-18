import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>NotaMed</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        Clinical Voice-to-Text Notes
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/record"
          style={{
            padding: '20px 40px',
            background: '#4CAF50',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1.2rem'
          }}
        >
          🎤 New Recording
        </Link>
        <Link
          to="/settings"
          style={{
            padding: '20px 40px',
            background: '#607D8B',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1.2rem'
          }}
        >
          ⚙️ Settings
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
