import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, X, Search as SearchIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Your app routes for search
  const pages = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Trucks List', path: '/trucks' },
    { name: 'New Truck', path: '/trucks/new' },
    { name: 'Schedules', path: '/schedule' },
    { name: 'New Schedule', path: '/schedule/new' },
    { name: 'Service Requests', path: '/service' },
    { name: 'New Service Request', path: '/service/new' },
    { name: 'Simulation', path: '/simulation' },
    { name: 'Profile', path: '/profile' },
  ];

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof pages>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setShowSearchDropdown(false);
      setResults([]);
    } else {
      setResults(
        pages.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      );
      setShowSearchDropdown(true);
    }
  }, [query]);

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setQuery('');
    setShowSearchDropdown(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      handleSearchSelect(results[0].path);
    }
  };

  // Notification state
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const handleAddNotification = () => {
    const msg = prompt('Enter notification text');
    if (msg && msg.trim()) {
      setNotifications(prev => [{ id: Date.now(), message: msg.trim() }, ...prev]);
    }
  };

  const handleRemoveNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleNotifications = () => {
    setShowNotifDropdown(open => !open);
    // close search if it was open
    setShowSearchDropdown(false);
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Global Search */}
        <div className="relative">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search..."
              className="px-3 py-1 w-48 focus:outline-none"
            />
            <button
              onClick={() => results.length > 0 && handleSearchSelect(results[0].path)}
              className="p-2 hover:bg-gray-100"
              aria-label="Search"
            >
              <SearchIcon size={18} />
            </button>
          </div>
          {showSearchDropdown && (
            <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {results.length > 0 ? (
                results.map(p => (
                  <li
                    key={p.path}
                    onClick={() => handleSearchSelect(p.path)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {p.name}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <ul className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto z-30">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <li
                    key={n.id}
                    className="px-3 py-2 flex justify-between items-center hover:bg-gray-100"
                  >
                    <span className="text-sm">{n.message}</span>
                    <button
                      onClick={() => handleRemoveNotification(n.id)}
                      aria-label="Remove notification"
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500">No notifications</li>
              )}
              <li className="border-t">
                <button
                  onClick={handleAddNotification}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add notification
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
