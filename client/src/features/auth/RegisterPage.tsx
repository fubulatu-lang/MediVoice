import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
      });
      toast.success('Account created!');
      // Force hard redirect to dashboard
      window.location.href = '/';
    } catch (error: any) {
      const message = error?.details?.detail || error?.message || 'Registration failed';
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-center">Create Account</h2>
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
          Full Name (Optional)
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50 outline-none"
          placeholder="Dr. Jane Smith"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50 outline-none"
          placeholder="doctor@hospital.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50 outline-none"
          placeholder="Min. 6 characters"
          required
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50 outline-none"
          placeholder="Repeat password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-700 text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-emerald-800 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-emerald-700 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
