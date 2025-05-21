import { Request, Response } from 'express';
import { Schedule } from '../models/schedule';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const schedules = await Schedule.find();
  res.json(schedules);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) {
    res.status(404).json({ error: 'Schedule not found' });
    return;
  }
  res.json(schedule);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const schedule = await Schedule.create(req.body);
  res.status(201).json(schedule);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!schedule) {
    res.status(404).json({ error: 'Schedule not found' });
    return;
  }
  res.json(schedule);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const total = await Schedule.countDocuments();
  const deliveries = await Schedule.countDocuments({ type: 'delivery' });
  const maintenance = await Schedule.countDocuments({ type: 'maintenance' });

  res.json({ total, deliveries, maintenance });
};
