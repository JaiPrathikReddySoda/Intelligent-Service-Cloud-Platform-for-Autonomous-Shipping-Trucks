import mongoose from 'mongoose';

export type TruckStatus = 'active' | 'maintenance' | 'idle';

const truckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'idle'],
    default: 'idle',
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String } 
  }
}, {
  timestamps: true,
});

export const Truck = mongoose.model('Truck', truckSchema);
