
import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

const AppLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <AppSidebar collapsed={!sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
