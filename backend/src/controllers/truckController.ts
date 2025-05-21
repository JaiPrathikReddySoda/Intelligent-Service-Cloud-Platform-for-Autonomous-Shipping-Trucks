// src/controllers/truckController.ts
import { Request, Response } from 'express';
import { Truck } from '../models/truck'; 
import { ServiceRequest } from '../models/servicerequest';
import { Schedule } from '../models/schedule';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const trucks = await Truck.find();
  res.json(trucks);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const truck = await Truck.findById(req.params.id);
  if (!truck) {
    res.status(404).json({ error: 'Truck not found' });
    return;
  }
  res.json(truck);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const truck = await Truck.create(req.body);
  res.status(201).json(truck);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!truck) {
    res.status(404).json({ error: 'Truck not found' });
    return;
  }
  res.json(truck);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  await Truck.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const allTrucks = await Truck.find();

  const totalTrucks = allTrucks.length;
  const activeTrucks = allTrucks.filter(t => t.status === 'active').length;
  const maintenanceTrucks = allTrucks.filter(t => t.status === 'maintenance').length;
  const idleTrucks = allTrucks.filter(t => t.status === 'idle').length;

  const pendingServiceRequests = await ServiceRequest.countDocuments({ status: 'pending' }); 
  const scheduledDeliveries = await Schedule.countDocuments({ type: 'delivery' });           
  const upcomingMaintenance = await Schedule.countDocuments({ type: 'maintenance' });        

  res.json({
    totalTrucks,
    activeTrucks,
    maintenanceTrucks,
    idleTrucks,
    pendingServiceRequests,
    scheduledDeliveries,
    upcomingMaintenance,
  });
};
