import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { serviceRequestAPI, trucksAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ServiceRequest {
  _id: string;
  truckId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface Truck {
  _id: string;
  name: string;
}

const ServiceRequestList: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState<'recent' | 'oldest'>('recent');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          serviceRequestAPI.getAll(),
          trucksAPI.getAll(),
        ]);
        setRequests(res1.data);
        setTrucks(res2.data);
      } catch (error) {
        toast.error('Failed to fetch service data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTruckName = (id: string) => {
    return trucks.find(t => t._id === id)?.name || 'Unknown';
  };

  const handleDelete = async (id: string) => {
    try {
      await serviceRequestAPI.delete(id);
      setRequests(prev => prev.filter(r => r._id !== id));
      toast.success('Request deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: ServiceRequest['status']) => {
    try {
      await serviceRequestAPI.update(id, { status: newStatus });
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status: newStatus } : r))
      );
      toast.success('Status updated');
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update status');
    }
  };

  const filtered = requests
    .filter(req => statusFilter === 'all' || req.status === statusFilter)
    .sort((a, b) =>
      sortOption === 'recent'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const statusBadgeClass = (status: string) => {
    return (
      'text-xs font-semibold px-2 py-1 rounded-full ' +
      (status === 'pending'
        ? 'bg-yellow-100 text-yellow-800'
        : status === 'in-progress'
        ? 'bg-blue-100 text-blue-800'
        : 'bg-green-100 text-green-800')
    );
  };

  const priorityCardClass = (priority?: string) => {
    return (
      'rounded-xl shadow hover:shadow-md transition flex flex-col justify-between h-full p-5 ' +
      (priority === 'high'
        ? 'bg-red-50 border border-red-300'
        : priority === 'medium'
        ? 'bg-yellow-50 border border-yellow-300'
        : 'bg-green-50 border border-green-300')
    );
  };

  const priorityBadgeClass = (priority?: string) => {
    return (
      'text-xs font-semibold px-2 py-1 rounded-full ' +
      (priority === 'high'
        ? 'bg-red-100 text-red-700'
        : priority === 'medium'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800')
    );
  };

  return (
    <div
      className="space-y-6 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/service-bg.jpg')" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-white/70 p-4 rounded-md shadow">
        <div>
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <p className="text-gray-500">Manage truck maintenance</p>
        </div>
        <Button onClick={() => navigate('/service/new')} className="flex items-center gap-2">
          <Plus size={16} /> New Request
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white/70 p-4 rounded-md shadow">
        <select
          className="border px-3 py-2 rounded-md"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="border px-3 py-2 rounded-md"
          value={sortOption}
          onChange={e => setSortOption(e.target.value as 'recent' | 'oldest')}
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-white">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-100">No service requests found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(req => (
            <div
              key={req._id}
              className={priorityCardClass(req.priority)}
            >
              <div>
                {/* Title + Badges */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold capitalize text-gray-800">{req.title}</h3>
                  <div className="flex gap-2 items-center">
                    <span className={statusBadgeClass(req.status)}>{req.status}</span>
                    {req.priority && <span className={priorityBadgeClass(req.priority)}>{req.priority}</span>}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 italic truncate mb-1">{req.description}</p>

                {/* Truck Info */}
                <p className="text-sm text-gray-700">
                  Truck: <span className="font-medium">{getTruckName(req.truckId)}</span>
                </p>

                {/* Relative Time */}
                <p className="text-sm text-gray-500 mb-2">
                  Created {formatDistanceToNow(new Date(req.createdAt))} ago
                </p>

                {/* Inline Status Update */}
                <div className="mt-2">
                  <label className="text-xs text-gray-500 block mb-1">Change Status</label>
                  <select
                    value={req.status}
                    onChange={e => handleStatusUpdate(req._id, e.target.value as ServiceRequest['status'])}
                    className="text-sm border rounded px-3 py-1 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" onClick={() => navigate(`/service/edit/${req._id}`)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(req._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestList;
