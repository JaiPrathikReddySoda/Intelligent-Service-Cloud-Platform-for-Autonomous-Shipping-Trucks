import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  truckId: { type: String, required: true },
  type: { type: String, enum: ['delivery', 'maintenance'], required: true },
  title: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  destination: { type: String },
  startLocation: { type: String},
  location: { type: String }, 
}, {
  timestamps: true
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);


