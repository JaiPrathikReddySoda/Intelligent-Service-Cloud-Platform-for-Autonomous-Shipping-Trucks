import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scheduleAPI, trucksAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationPicker from '@/components/LocationPicker';
import { reverseGeocode } from '@/lib/reverseGeocode';

interface Schedule {
  id?: string;
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

const ScheduleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [formData, setFormData] = useState<Schedule>({
    truckId: '',
    type: 'delivery',
    title: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    startLocation: '',
    destination: '',
    location: ''
  });

  const [startCoords, setStartCoords] = useState({ lat: 37.3382, lng: -121.8863 });
  const [endCoords, setEndCoords] = useState({ lat: 37.3348, lng: -121.8881 });
  const [maintenanceCoords, setMaintenanceCoords] = useState({ lat: 37.3382, lng: -121.8863 });

  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [maintenanceAddress, setMaintenanceAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trucksRes = await trucksAPI.getAll();
        setTrucks(trucksRes.data);

        if (isEditMode && id) {
          const scheduleRes = await scheduleAPI.getById(id);
          const data = scheduleRes.data;
          if (data) {
            setFormData({
              truckId: data.truckId,
              type: data.type,
              title: data.title,
              startDate: new Date(data.startDate).toISOString().slice(0, 16),
              endDate: new Date(data.endDate).toISOString().slice(0, 16),
              startLocation: data.startLocation || '',
              destination: data.destination || '',
              location: data.location || ''
            });

            if (data.startLocation) {
              const [lat, lng] = data.startLocation.split(',').map(Number);
              setStartCoords({ lat, lng });
            }
            if (data.destination) {
              const [lat, lng] = data.destination.split(',').map(Number);
              setEndCoords({ lat, lng });
            }
            if (data.location) {
              const [lat, lng] = data.location.split(',').map(Number);
              setMaintenanceCoords({ lat, lng });
            }
          } else {
            toast({ title: 'Error', description: 'Schedule not found', variant: 'destructive' });
            navigate('/schedule');
          }
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    if (formData.type === 'delivery') {
      setFormData(prev => ({
        ...prev,
        startLocation: `${startCoords.lat},${startCoords.lng}`,
        destination: `${endCoords.lat},${endCoords.lng}`
      }));
      reverseGeocode(startCoords.lat, startCoords.lng).then(setStartAddress);
      reverseGeocode(endCoords.lat, endCoords.lng).then(setEndAddress);
    } else {
      setFormData(prev => ({
        ...prev,
        location: `${maintenanceCoords.lat},${maintenanceCoords.lng}`
      }));
      reverseGeocode(maintenanceCoords.lat, maintenanceCoords.lng).then(setMaintenanceAddress);
    }
  }, [startCoords, endCoords, maintenanceCoords, formData.type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      if (isEditMode && id) {
        await scheduleAPI.update(id, payload);
        toast({ title: 'Success', description: 'Schedule updated', variant: 'success' });
      } else {
        await scheduleAPI.create(payload);
        toast({ title: 'Success', description: 'Schedule created', variant: 'success' });
      }
      navigate('/schedule');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save schedule', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Schedule' : 'Create New Schedule'}</h1>
        <p className="text-gray-500">{isEditMode ? 'Update your schedule' : 'Add a new schedule to your fleet'}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>

        {/* Truck */}
        <div>
          <Label htmlFor="truckId">Truck</Label>
          <Select value={formData.truckId} onValueChange={v => handleSelectChange('truckId', v)} required>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select a truck" /></SelectTrigger>
            <SelectContent>
              {trucks.map(t => (
                <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={v => handleSelectChange('type', v as 'delivery' | 'maintenance')} required>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date & Time</Label>
            <Input id="startDate" name="startDate" type="datetime-local" value={formData.startDate} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="endDate">End Date & Time</Label>
            <Input id="endDate" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleInputChange} required />
          </div>
        </div>

        {/* Location */}
        {formData.type === 'delivery' ? (
          <>
            <LocationPicker label="Start Location" coords={startCoords} onChange={setStartCoords} address={startAddress} />
            <LocationPicker label="Destination" coords={endCoords} onChange={setEndCoords} address={endAddress} />
          </>
        ) : (
          <LocationPicker label="Maintenance Location" coords={maintenanceCoords} onChange={setMaintenanceCoords} address={maintenanceAddress} />
        )}

        <Separator />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate('/schedule')}>Cancel</Button>
          <Button type="submit">{isEditMode ? 'Update Schedule' : 'Create Schedule'}</Button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
