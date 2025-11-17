import { useState, useEffect, useCallback } from 'react';
import {
  getAdminDashboard,
  getUsers,
  getUserRatings,
  getStoreDetails,
  submitRating,
  updatePassword,
  getStores,
  getAllRatings,
  getMyStore
} from '../api';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [search, setSearch] = useState({ name: '', address: '' });
  const [adminFilters, setAdminFilters] = useState({ users: { name: '', email: '', role: '' }, stores: { name: '', address: '' } });
  const [activeTab, setActiveTab] = useState('users');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const fetchAdminData = useCallback(() => {
    getAdminDashboard().then(res => setDashboardData(res.data));
    getUsers({ sortBy: sortConfig.key, sortOrder: sortConfig.direction }).then(res => setUsers(res.data));
    getAllRatings({ sortBy: 'created_at', sortOrder: 'desc' }).then(res => setRatings(res.data));
    getStores({ sortBy: 'name', sortOrder: 'asc' }).then(res => setStores(res.data));
  }, [sortConfig]);

  const fetchNormalUserData = useCallback(() => {
    getUserRatings().then(res => setStores(res.data));
  }, []);

  const fetchStoreOwnerData = useCallback(async () => {
    try {
      const storeRes = await getMyStore();
      const storeId = storeRes.data[0]?.id;
      if (storeId) {
        const detailsRes = await getStoreDetails(storeId);
        setDashboardData(detailsRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch store owner data", err);
    }
  }, []);

  useEffect(() => {
    if (user.role === 'admin') {
      fetchAdminData();
    } else if (user.role === 'normal_user') {
      fetchNormalUserData();
    } else if (user.role === 'store_owner') {
      fetchStoreOwnerData();
    }
  }, [user, sortConfig, fetchAdminData, fetchNormalUserData, fetchStoreOwnerData]);

  const handleRating = async (storeId, rating) => {
    try {
      await submitRating({ store_id: storeId, rating });
      fetchNormalUserData();
    } catch (err) {
      alert('Error submitting rating');
    }
  };

  const handleSearch = () => {
    getStores(search).then(res => setStores(res.data));
  };

  const handleAdminFilterChange = (tab, filterName, value) => {
    setAdminFilters(prev => ({ ...prev, [tab]: { ...prev[tab], [filterName]: value } }));
  };

  const handleAdminSearch = (tab) => {
    if (tab === 'users') {
      getUsers({ ...adminFilters.users, sortBy: sortConfig.key, sortOrder: sortConfig.direction }).then(res => setUsers(res.data));
    } else if (tab === 'stores') {
      getStores({ ...adminFilters.stores, sortBy: sortConfig.key, sortOrder: sortConfig.direction }).then(res => setStores(res.data));
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'asc') return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline ml-1" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/>
      </svg>
    );
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline ml-1" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/>
    </svg>;
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-6xl">
      {user.role === 'admin' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Stats</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded">Total Users: {dashboardData.total_users}</div>
            <div className="bg-green-100 p-4 rounded">Total Stores: {dashboardData.total_stores}</div>
            <div className="bg-yellow-100 p-4 rounded">Total Ratings: {dashboardData.total_ratings}</div>
          </div>
          <div className="mb-4 space-x-2">
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Users</button>
            <button onClick={() => setActiveTab('ratings')} className={`px-4 py-2 rounded ${activeTab === 'ratings' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Ratings</button>
            <button onClick={() => setActiveTab('stores')} className={`px-4 py-2 rounded ${activeTab === 'stores' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Stores</button>
          </div>
          {activeTab === 'users' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Users</h3>
              <div className="flex space-x-2 mb-4">
                <input placeholder="Filter by Name" value={adminFilters.users.name} onChange={(e) => handleAdminFilterChange('users', 'name', e.target.value)} className="px-3 py-2 border border-gray-300 rounded w-full"/>
                <input placeholder="Filter by Email" value={adminFilters.users.email} onChange={(e) => handleAdminFilterChange('users', 'email', e.target.value)} className="px-3 py-2 border border-gray-300 rounded w-full"/>
                <select value={adminFilters.users.role} onChange={(e) => handleAdminFilterChange('users', 'role', e.target.value)} className="px-3 py-2 border border-gray-300 rounded w-full">
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="normal_user">Normal User</option>
                </select>
                <button onClick={() => handleAdminSearch('users')} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Search</button>
                <button onClick={() => {
                  setAdminFilters(prev => ({ ...prev, users: { name: '', email: '', role: '' } }));
                  getUsers({}).then(res => setUsers(res.data));
                }} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                  Clear
                </button>
              </div>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('name')}>Name{getSortIndicator('name')}</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('email')}>Email{getSortIndicator('email')}</th>
                    <th className="border border-gray-300 px-4 py-2">Address</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('role')}>Role{getSortIndicator('role')}</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('rating')}>Rating{getSortIndicator('rating')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="border border-gray-300 px-4 py-2">{u.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{u.address}</td>
                      <td className="border border-gray-300 px-4 py-2">{u.role}</td>
                      <td className="border border-gray-300 px-4 py-2">{u.role === 'store_owner' ? (parseFloat(u.rating).toFixed(2) || 'N/A') : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'ratings' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Ratings</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('user_name')}>User{getSortIndicator('user_name')}</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('store_name')}>Store{getSortIndicator('store_name')}</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('rating')}>Rating{getSortIndicator('rating')}</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('created_at')}>Date{getSortIndicator('created_at')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map(r => (
                    <tr key={r.id}>
                      <td className="border border-gray-300 px-4 py-2">{r.user_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{r.store_name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= r.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  </td>
                      <td className="border border-gray-300 px-4 py-2">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'stores' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Stores</h3>
                <button onClick={() => navigate('/create-store')} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Create Store</button>
              </div>
              <div className="flex space-x-2 mb-4">
                <input placeholder="Filter by Name" value={adminFilters.stores.name} onChange={(e) => handleAdminFilterChange('stores', 'name', e.target.value)} className="px-3 py-2 border border-gray-300 rounded w-full"/>
                <input placeholder="Filter by Address" value={adminFilters.stores.address} onChange={(e) => handleAdminFilterChange('stores', 'address', e.target.value)} className="px-3 py-2 border border-gray-300 rounded w-full"/>
                <button onClick={() => handleAdminSearch('stores')} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Search</button>
                <button onClick={() => {
                  setAdminFilters(prev => ({ ...prev, stores: { name: '', address: '' } }));
                  getStores({}).then(res => setStores(res.data));
                }} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                  Clear
                </button>
              </div>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('name')}>Name{getSortIndicator('name')}</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('email')}>Email{getSortIndicator('email')}</th>
                    <th className="border border-gray-300 px-4 py-2">Address</th>
                    <th className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => requestSort('overall_rating')}>Rating{getSortIndicator('overall_rating')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(s => (
                    <tr key={s.id}>
                      <td className="border border-gray-300 px-4 py-2">{s.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{s.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{s.address}</td>
                      <td className="border border-gray-300 px-4 py-2">{s.overall_rating ? parseFloat(s.overall_rating).toFixed(2) : 'N/A'}</td>
                      {/* <td className="border border-gray-300 px-4 py-2">
                        {s.overall_rating ? (
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= Math.round(parseFloat(s.overall_rating)) ? 'text-yellow-500' : 'text-gray-300'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                </svg>
                              </span>
                            ))}
                          </div>
                        ) : 'N/A'}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {user.role === 'normal_user' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Stores</h3>
          <div className="flex space-x-2 mb-4">
            <input
              placeholder="Search Name"
              value={search.name}
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Search Address"
              value={search.address}
              onChange={(e) => setSearch({ ...search, address: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Search</button>
          </div>
          <ul className="space-y-2">
            {stores.map(s => (
              <li key={s.id} className="border p-4 rounded flex justify-between items-center">
                <div className="flex-grow">
                  {s.name} - {s.address} - Rating: {s.overall_rating ? (
                    <div className="flex inline-flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= Math.round(parseFloat(s.overall_rating)) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  ) : 'Not rated'}
                  Your Rating: {s.user_rating ? (
                    <div className="flex inline-flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= s.user_rating ? 'text-yellow-500' : 'text-gray-300'}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                          </svg>
                        </span>
                      ))}
                    </div>
                  ) : 'Not rated'}
                </div>
                <StarRating onRate={(rating) => handleRating(s.id, rating)} initialRating={s.user_rating || 0} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {user.role === 'store_owner' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Store Ratings</h3>
          <p className="mb-4">Average Rating: {dashboardData.average_rating ? parseFloat(dashboardData.average_rating).toFixed(2) : 'N/A'}</p>
          <ul className="space-y-2">
            {dashboardData.ratings && dashboardData.ratings.length > 0 ? (
              dashboardData.ratings.map((r, index) => (
                <li key={index} className="border p-2 rounded">{r.user_name}: {r.rating} stars</li>
              ))
            ) : (
              <p>No ratings have been submitted for your store yet.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
