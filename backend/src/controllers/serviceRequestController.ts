import { Request, Response } from 'express';
import { ServiceRequest } from '../models/servicerequest';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const requests = await ServiceRequest.find();
  res.json(requests);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) {
    res.status(404).json({ error: 'Service request not found' });
    return;
  }
  res.json(request);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const request = await ServiceRequest.create(req.body);
  res.status(201).json(request);
};

// ✅ UPDATED: now supports partial updates safely
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // Ensures valid status, priority, etc.
    });

    if (!updatedRequest) {
      res.status(404).json({ error: 'Service request not found' });
      return;
    }

    res.json(updatedRequest);
  } catch (err) {
    console.error('Update failed:', err); // Logs issue for backend devs
    res.status(500).json({ error: 'Failed to update service request' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  await ServiceRequest.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

export const getServiceRequestStats = async (req: Request, res: Response) => {
  try {
    const requests = await ServiceRequest.find();
    const pending = requests.filter(r => r.status === 'pending').length;
    const inProgress = requests.filter(r => r.status === 'in-progress').length;
    const completed = requests.filter(r => r.status === 'completed').length;

    res.json({
      pending,
      inProgress,
      completed,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service request stats' });
  }
};
