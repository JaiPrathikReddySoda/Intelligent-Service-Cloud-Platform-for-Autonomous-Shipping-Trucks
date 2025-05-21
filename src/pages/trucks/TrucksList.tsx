import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, TruckIcon } from 'lucide-react';
import { trucksAPI, Truck, TruckStatus } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import TruckMap from '@/components/TruckMap';

interface EnrichedTruck extends Truck {
  address?: string;
  location?: { lat: number; lng: number };
}

const TrucksList: React.FC = () => {
  const [trucks, setTrucks] = useState<EnrichedTruck[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TruckStatus>('all');
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast({ title: 'Success', description: location.state.message });
    }
  }, [location]);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const response = await trucksAPI.getAll();
      const withId = response.data.map((t: any) => ({ ...t, id: t._id || t.id }));
      const enriched = await Promise.all(
        withId.map(async (truck: any) => {
          let address = 'N/A';
          if (truck.location?.lat && truck.location?.lng) {
            address = await reverseGeocode(truck.location.lat, truck.location.lng);
          }
          return { ...truck, address };
        })
      );
      setTrucks(enriched);
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load trucks.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this truck?')) return;
    try {
      await trucksAPI.delete(id);
      toast({ title: 'Success', description: 'Truck deleted.' });
      fetchTrucks();
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Delete failed.' });
    }
  };

  const filteredTrucks = trucks.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderStatusBadge = (status: TruckStatus) => {
    const base = 'text-xs px-2 py-1 rounded-full flex items-center gap-1';
    switch (status) {
      case 'active':
        return <span className={`${base} bg-green-100 text-green-800`}>🟢 Active</span>;
      case 'maintenance':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>🛠️ Maintenance</span>;
      case 'idle':
        return <span className={`${base} bg-gray-100 text-gray-600`}>⚪ Idle</span>;
      default:
        return <span className={base}>Unknown</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Overview</h1>
          <p className="text-gray-500 text-sm">Visual status and location for all registered trucks.</p>
        </div>
        <Link
          to="/trucks/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          <Plus size={18} /> Add New Truck
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search trucks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border rounded-md text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="idle">Idle</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : filteredTrucks.length === 0 ? (
        <div className="text-center py-12">
          <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No trucks found</h3>
          <p className="mt-2 text-gray-500">Adjust filters or add a new truck.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrucks.map((truck) => (
            <div
              key={truck.id}
              className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-[1.01]"
              style={{
                backgroundImage: `url('/public/card-bg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="bg-gradient-to-b from-black/50 via-black/30 to-black/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{truck.name}</h3>
                  {renderStatusBadge(truck.status)}
                </div>

                <p className="text-sm text-gray-700">
                  <strong>Model:</strong> {truck.model}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Year:</strong> {truck.year}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Location:</strong>
                </p>
                <p className="text-xs italic text-gray-500">{truck.address}</p>

                {truck.location?.lat && truck.location?.lng ? (
                  <TruckMap
                    lat={truck.location.lat}
                    lng={truck.location.lng}
                    name={truck.name}
                    status={truck.status}
                  />
                ) : (
                  <img
                    src="/public/default-truck.jpg"
                    alt="Default Truck"
                    className="rounded-md w-full h-40 object-cover"
                  />
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Link
                    to={`/trucks/edit/${truck.id}`}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(truck.id!)}
                    className="p-2 rounded bg-red-100 hover:bg-red-200"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrucksList;
