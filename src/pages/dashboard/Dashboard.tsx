import React, { useState, useEffect } from 'react';
import {
  Truck,
  Calendar,
  Wrench,
  PlayCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { trucksAPI } from '@/services/api';
import StatCard from '@/components/ui/dashboard/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardStats {
  totalTrucks: number;
  activeTrucks: number;
  maintenanceTrucks: number;
  idleTrucks: number;
  pendingServiceRequests: number;
  scheduledDeliveries: number;
  upcomingMaintenance: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await trucksAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-4 text-lg font-medium">Failed to load dashboard data</h3>
        <p className="mt-2 text-gray-500">Please try refreshing the page</p>
      </div>
    );
  }

  const truckStatusData = [
    { name: 'Active', value: stats.activeTrucks, color: '#26C6DA' },
    { name: 'Maintenance', value: stats.maintenanceTrucks, color: '#FF9800' },
    { name: 'Idle', value: stats.idleTrucks, color: '#757575' },
  ];

  const serviceRequestsData = [
    { name: 'Pending', value: stats.pendingServiceRequests, color: '#FF9800' },
    { name: 'Deliveries', value: stats.scheduledDeliveries, color: '#26C6DA' },
    { name: 'Maintenance', value: stats.upcomingMaintenance, color: '#8E24AA' },
  ];

  return (
    <div className="space-y-8">
      {/* 📸 Banner Image Section */}
      <div className="w-full h-40 rounded-xl overflow-hidden shadow mb-4">
        <img
          src="/dashboard-banner.png"
          alt="Fleet Dashboard"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to the fleet management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Trucks" value={stats.totalTrucks} icon={Truck} color="app-teal-light" />
        <StatCard title="Active Trucks" value={stats.activeTrucks} icon={TrendingUp} color="app-teal" trend={{ value: 12, isPositive: true }} />
        <StatCard title="Scheduled Deliveries" value={stats.scheduledDeliveries} icon={Calendar} color="app-blue-light" />
        <StatCard title="Pending Service Requests" value={stats.pendingServiceRequests} icon={Wrench} color="yellow-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-6">Truck Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={truckStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {truckStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-6">Service Requests Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceRequestsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {serviceRequestsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/trucks/new" className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <Truck className="h-5 w-5 mr-3 text-app-teal" />
            <span>Add New Truck</span>
          </a>
          <a href="/schedule/new" className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <Calendar className="h-5 w-5 mr-3 text-app-blue-light" />
            <span>Schedule Delivery</span>
          </a>
          <a href="/service/new" className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <Wrench className="h-5 w-5 mr-3 text-yellow-500" />
            <span>Request Service</span>
          </a>
          <a href="/simulation" className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <PlayCircle className="h-5 w-5 mr-3 text-green-500" />
            <span>Start Simulation</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
