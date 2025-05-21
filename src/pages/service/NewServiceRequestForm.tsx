// ✅ 2. NewServiceRequestForm.tsx (Final)

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { trucksAPI, serviceRequestAPI } from '@/services/api';
import { AlertTriangle } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form, FormField, FormItem, FormLabel, FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  truckId: z.string().min(1, 'Truck is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in-progress', 'completed']),
});

type FormValues = z.infer<typeof formSchema>;

interface Truck {
  _id: string;
  name: string;
}

const NewServiceRequestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truckId: '',
      title: '',
      description: '',
      priority: 'low',
      status: 'pending',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const truckRes = await trucksAPI.getAll();
        setTrucks(truckRes.data);

        if (isEditMode && id) {
          const res = await serviceRequestAPI.getServiceRequestById(id);
          const s = res.data;
          form.setValue('truckId', s.truckId);
          form.setValue('title', s.title);
          form.setValue('description', s.description);
          form.setValue('priority', s.priority || 'low');
          form.setValue('status', s.status);
        }
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEditMode]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      truckId: data.truckId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      createdAt: new Date().toISOString(),
    };

    try {
      if (isEditMode && id) {
        await serviceRequestAPI.update(id, payload);
        toast.success('Updated successfully');
      } else {
        await serviceRequestAPI.create(payload);
        toast.success('Created successfully');
      }
      navigate('/service');
    } catch (err) {
      toast.error('Submit failed');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Service Request' : 'New Service Request'}</h1>
        <p className="text-gray-500">Submit a maintenance or repair request</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">

          <FormField
            control={form.control}
            name="truckId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Truck</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a truck" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trucks.map(t => (
                      <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Engine issue" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the issue..." {...field} className="min-h-[120px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/service')}>Cancel</Button>
            <Button type="submit" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewServiceRequestForm;
