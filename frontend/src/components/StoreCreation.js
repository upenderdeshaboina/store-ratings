import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStore, getUsers } from '../api';

function StoreCreation() {
  const [storeData, setStoreData] = useState({ name: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getUsers({ role: 'store_owner' })
      .then(res => {
        setOwners(res.data);
        if (res.data.length > 0) {
          setStoreData(prev => ({ ...prev, owner_id: res.data[0].id }));
        }
      })
      .catch(() => setError('Could not fetch store owners.'));
  }, []);

  const handleChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeData.name || !storeData.address || !storeData.owner_id) {
      setError('All fields are required.');
      return;
    }
    try {
      await createStore(storeData);
      alert('Store created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store.');
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Store</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Store Name</label>
          <input name="name" value={storeData.name} onChange={handleChange} placeholder="Store Name" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-gray-700">Store Address</label>
          <textarea name="address" value={storeData.address} onChange={handleChange} placeholder="Store Address" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-gray-700">Assign Owner</label>
          <select name="owner_id" value={storeData.owner_id} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
            <option value="" disabled>Select an owner</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Create Store</button>
      </form>
    </div>
  );
}

export default StoreCreation;