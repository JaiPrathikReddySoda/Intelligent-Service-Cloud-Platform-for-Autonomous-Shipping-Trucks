import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Pencil, Plus, Trash2, TruckIcon } from 'lucide-react';
import { scheduleAPI, trucksAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { reverseGeocode } from '@/lib/reverseGeocode';
import ScheduleMap from '@/components/ScheduleMap';
import { Button } from '@/components/ui/button';

interface Schedule {
  _id: string;
  truckId: string;
  type: 'delivery' | 'maintenance';
  title: string;
  startDate: string;
  endDate: string;
  startLocation?: string;
  destination?: string;
  location?: string;
}

interface Truck {
  _id: string;
  name: string;
}

const ScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'delivery' | 'maintenance'>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, trucksRes] = await Promise.all([
          scheduleAPI.getAll(),
          trucksAPI.getAll()
        ]);

        const typedSchedules: Schedule[] = schedulesRes.data.map((s: any) => ({
          ...s,
          type: s.type as 'delivery' | 'maintenance'
        }));

        setSchedules(typedSchedules);
        setTrucks(trucksRes.data);

        for (const sched of typedSchedules) {
          const coords = [sched.startLocation, sched.destination, sched.location];
          for (const c of coords) {
            if (c && !addresses[c]) {
              const [lat, lng] = c.split(',').map(Number);
              const addr = await reverseGeocode(lat, lng);
              setAddresses(prev => ({ ...prev, [c]: addr }));
            }
          }
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to load schedules', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTruckName = (id: string) =>
    trucks.find((t) => t._id === id)?.name || 'Unknown Truck';

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });

  const getTypeColor = (type: string) =>
    type === 'delivery'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-yellow-100 text-yellow-800';

  const handleDelete = async (id: string) => {
    try {
      await scheduleAPI.delete(id);
      setSchedules((prev) => prev.filter((s) => s._id !== id));
      toast({ title: 'Deleted', description: 'Schedule removed', variant: 'success' });
    } catch {
      toast({ title: 'Error', description: 'Could not delete schedule', variant: 'destructive' });
    }
  };

  const filtered = schedules.filter((s) => filter === 'all' || s.type === filter);

  return (
    <div
      className="space-y-6 min-h-screen bg-cover bg-center px-4 py-6"
      style={{ backgroundImage: "url('/schedule-page-bg.jpg')" }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white drop-shadow">Schedule Management</h1>
          <p className="text-gray-100 drop-shadow">Manage delivery and maintenance schedules for your fleet</p>
        </div>
        <div className="flex gap-4">
          <select
            className="border rounded-md px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="delivery">Delivery</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <Button onClick={() => navigate('/schedule/new')} className="flex items-center gap-2">
            <Plus size={18} /> Add New Schedule
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-white">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-300">No schedules found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="bg-white/90 backdrop-blur rounded-xl shadow hover:shadow-lg transition border border-gray-200"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(s.type)}`}>
                    {s.type.charAt(0).toUpperCase() + s.type.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <TruckIcon size={14} /> {getTruckName(s.truckId)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock size={14} />
                  {formatDate(s.startDate)} → {formatDate(s.endDate)}
                </div>

                <div className="rounded overflow-hidden mb-3">
                  <ScheduleMap
                    type={s.type}
                    start={s.startLocation ? toCoords(s.startLocation) : undefined}
                    end={s.destination ? toCoords(s.destination) : undefined}
                    location={s.location ? toCoords(s.location) : undefined}
                  />
                </div>

                <div className="text-xs italic text-gray-500 mb-2">
                  {s.type === 'delivery' ? (
                    <>
                      <div>From: {addresses[s.startLocation!]}</div>
                      <div>To: {addresses[s.destination!]}</div>
                    </>
                  ) : (
                    <div>At: {addresses[s.location!]}</div>
                  )}
                </div>

                <div className="flex justify-end items-center text-xs text-gray-400 mt-1">
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/schedule/edit/${s._id}`)} className="hover:text-primary">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const toCoords = (str: string) => {
  const [lat, lng] = str.split(',').map(Number);
  return { lat, lng };
};

export default ScheduleList;
