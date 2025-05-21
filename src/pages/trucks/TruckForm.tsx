// Updated TruckForm.tsx with LocationPicker
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { trucksAPI, TruckStatus } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import LocationPicker from '@/components/LocationPicker';

interface TruckFormData {
  name: string;
  model: string;
  year: number;
  status: TruckStatus;
  location: {
    lat: number;
    lng: number;
  };
}

const TruckForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<TruckFormData>({
    name: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'active',
    location: { lat: 37.3382, lng: -121.8863 }
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return setLoading(false);
    trucksAPI.getById(id).then((res) => {
      if (res.data) {
        setFormData({
          name: res.data.name,
          model: res.data.model,
          year: res.data.year,
          status: res.data.status,
          location: res.data.location || { lat: 37.3382, lng: -121.8863 }
        });
      } else {
        toast({ variant: "destructive", title: "Not Found", description: "Truck not found." });
        navigate('/trucks');
      }
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode && id) {
        await trucksAPI.update(id, formData);
        navigate('/trucks', { state: { message: 'Truck updated successfully!' } });
      } else {
        await trucksAPI.create(formData);
        navigate('/trucks', { state: { message: 'Truck created successfully!' } });
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: "Save failed." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/trucks')} className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Truck' : 'Add New Truck'}</h1>
          <p className="text-gray-500">{isEditMode ? 'Update truck info' : 'Enter new truck details'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="name" placeholder="Truck Name" value={formData.name} onChange={handleChange} required className="input" />
          <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} required className="input" />
          <input type="number" name="year" value={formData.year} onChange={handleChange} className="input" min="2000" max={new Date().getFullYear() + 2} required />
          <select name="status" value={formData.status} onChange={handleChange} className="input" required>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="idle">Idle</option>
          </select>
        </div>

        <LocationPicker
          label="Truck Location"
          coords={formData.location}
          onChange={(coords) => setFormData((prev) => ({ ...prev, location: coords }))}
        />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/trucks')} className="btn-outline">Cancel</button>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={submitting}>
            <Save size={18} />
            <span>{isEditMode ? 'Update Truck' : 'Create Truck'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TruckForm;
