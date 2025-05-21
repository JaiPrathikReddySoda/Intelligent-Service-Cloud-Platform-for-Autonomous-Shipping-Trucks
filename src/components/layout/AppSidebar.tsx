
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Truck, 
  Calendar, 
  Wrench, 
  PlayCircle,
  User,
  LogOut
} from 'lucide-react';

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const { logout, user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Trucks', path: '/trucks', icon: <Truck size={20} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
    { name: 'Service', path: '/service', icon: <Wrench size={20} /> },
    { name: 'Simulation', path: '/simulation', icon: <PlayCircle size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed w-64 transition-all duration-300 ease-in-out overflow-hidden"
         style={{ width: collapsed ? '5rem' : '16rem' }}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 h-16">
        <div className="w-8 h-8 bg-app-teal rounded-md flex items-center justify-center">
          <Truck size={18} className="text-white" />
        </div>
        {!collapsed && <span className="font-bold text-lg tracking-tight whitespace-nowrap">TOS</span>}
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-white font-medium'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60'
                  }`
                }
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {!collapsed && <span className="truncate-text">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-medium truncate-text">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate-text">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent/60 transition-colors"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
