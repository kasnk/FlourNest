import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [view, setView] = useState('pending');
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests?status=${view}`);
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  const markAsComplete = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/complete/${id}`);
      fetchRequests();
    } catch (error) {
      console.error('Failed to mark as complete', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  useEffect(() => {
    fetchRequests();
  }, [view]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          🧾 FlourMill Admin Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6 justify-center sm:justify-start">
        {['pending', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setView(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              view === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No {view} requests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.uniqueId}
              className="bg-white shadow-sm rounded-lg p-5 border border-gray-200 flex flex-col justify-between"
            >
              <div className="mb-3 space-y-1">
                <p className="text-gray-700 font-semibold">🆔 {req.uniqueId}</p>
                <p className="text-sm text-gray-600">📱 {req.phone}</p>
                <p className="text-sm text-gray-600">🧺 {req.containerType}</p>
                <p className="text-xs text-gray-400">
                  ⏱️ {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
              {view === 'pending' && (
                <button
                  onClick={() => markAsComplete(req.uniqueId)}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm"
                >
                  Mark as Done
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;