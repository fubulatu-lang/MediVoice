import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h1>NotaMed</h1>
      <p>Clinical Voice-to-Text Notes</p>
      <Link to="/record" style={{
        display: 'inline-block',
        padding: '20px 40px',
        background: '#4CAF50',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none'
      }}>
        🎤 New Recording
      </Link>
    </div>
  );
};

export default DashboardPage;
