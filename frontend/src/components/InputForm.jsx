import { useState } from 'react';
import axios from 'axios';

const InputForm = () => {
  const [formData, setFormData] = useState({ phone: '', containerType: '' });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:5000/api/submit', formData);
      setMessage(`✅ Order submitted! Your ID is ${response.data.uniqueId}`);
      setFormData({ phone: '', containerType: '' });
    } catch (err) {
      setMessage('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Enter Your Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="phone"
          type="tel"
          required
          pattern="[0-9]{10}"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="containerType"
          required
          value={formData.containerType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Container Type</option>
          <option value="Plastic">Plastic</option>
          <option value="Steel Dabba">Steel Dabba</option>
          <option value="Thaila">Thaila</option>
          <option value="Sack">Sack</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-teal-600">{message}</p>
      )}
    </div>
  );
};

export default InputForm;