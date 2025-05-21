import mongoose from 'mongoose';

export type ServiceRequestStatus = 'pending' | 'in-progress' | 'completed';

const serviceRequestSchema = new mongoose.Schema({
  truckId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
});

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
