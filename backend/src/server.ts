import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';
import trucksRouter from './routes/trucks';
import serviceRequestRoutes from './routes/serviceRequest';
import scheduleRoutes from './routes/schedule';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/trucks', trucksRouter);
app.use('/api/servicerequests', serviceRequestRoutes);
app.use('/api/schedule', scheduleRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || '', {}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
});

