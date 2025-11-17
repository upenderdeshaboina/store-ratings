import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <Link className="text-xl font-bold" to='/dashboard'>MYSTORES</Link>
        <div className="flex items-center space-x-4">
          {user.role === 'admin' && (
            <Link to="/create-user" className="relative inline-block
         after:absolute after:left-1/2 after:-translate-x-1/2 
         after:bottom-1
         after:h-[2px] after:w-0 after:bg-white
         after:transition-all after:duration-300
         hover:after:w-full hover:after:bottom-1 px-2 py-2 rounded">
              Create User
            </Link>
          )}
          {user.role === 'admin' && (
            <Link to="/create-store" className="relative inline-block
         after:absolute after:left-1/2 after:-translate-x-1/2 
         after:bottom-1
         after:h-[2px] after:w-0 after:bg-white
         after:transition-all after:duration-300
         hover:after:w-full hover:after:bottom-1 px-2 py-2 rounded">
              Create Store
            </Link>
          )}
          <Link to="/change-password" className="relative inline-block
         after:absolute after:left-1/2 after:-translate-x-1/2 
         after:bottom-1
         after:h-[2px] after:w-0 after:bg-white
         after:transition-all after:duration-300
         hover:after:w-full hover:after:bottom-1 px-2 py-2 rounded">
            Change Password
          </Link>
          <button onClick={handleLogout} className="hover:bg-transparent border hover:text-red-500 transition duration-300 ease-in-out focus:outline-none px-4 py-2 rounded bg-blurred-600">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
