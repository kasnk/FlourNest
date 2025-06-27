import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      form.username === import.meta.env.VITE_ADMIN_USER &&
      form.password === import.meta.env.VITE_ADMIN_PASS
    ) {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
      console.log('Submitted:', form.username, form.password);

    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center text-gray-700">Admin Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;