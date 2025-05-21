
import React, { useState } from 'react';
import { Play, Pause, Camera } from 'lucide-react';
import { simulationAPI } from '@/services/api';
import { useToast } from "@/components/ui/use-toast";

interface SimulationStatus {
  isRunning: boolean;
  startedAt: string | null;
  currentSpeed: number;
  currentLocation: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  estimatedArrival: string | null;
  cameraFramePath: string;
}

const Simulation: React.FC = () => {
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startSimulation = async () => {
    setLoading(true);
    try {
      const response = await mockAPI.startSimulation();
      setSimulationStatus(response.data);
      
      toast({
        title: "Simulation started",
        description: "The autonomous truck simulation is now running.",
      });
    } catch (error) {
      console.error('Error starting simulation:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start the simulation. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSimulationStatus = async () => {
    setLoading(true);
    try {
      const response = await mockAPI.getSimulationStatus();
      setSimulationStatus(response.data);
    } catch (error) {
      console.error('Error getting simulation status:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get simulation status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCoordinates = (coords: { lat: number; lng: number }) => {
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulation</h1>
        <p className="text-gray-500">Run and monitor autonomous truck simulations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Simulation Controls</h2>
          
          <div className="mb-6">
            <p className="text-gray-500 mb-4">
              Start a new simulation to test autonomous driving capabilities in a virtual environment.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={startSimulation}
                disabled={loading || (simulationStatus?.isRunning ?? false)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play size={18} />
                <span>Start Simulation</span>
              </button>
              
              <button
                onClick={getSimulationStatus}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="animate-spin">⌛</span>
                ) : (
                  <Camera size={18} />
                )}
                <span>Get Status</span>
              </button>
            </div>
          </div>
          
          {simulationStatus && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Current Status</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${simulationStatus.isRunning ? 'text-green-600' : 'text-gray-600'}`}>
                    {simulationStatus.isRunning ? 'Running' : 'Stopped'}
                  </span>
                </div>
                
                {simulationStatus.startedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Started At:</span>
                    <span className="font-medium">{new Date(simulationStatus.startedAt).toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Speed:</span>
                  <span className="font-medium">{simulationStatus.currentSpeed} mph</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Location:</span>
                  <span className="font-medium">{formatCoordinates(simulationStatus.currentLocation)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination:</span>
                  <span className="font-medium">{formatCoordinates(simulationStatus.destination)}</span>
                </div>
                
                {simulationStatus.estimatedArrival && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated Arrival:</span>
                    <span className="font-medium">{new Date(simulationStatus.estimatedArrival).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Camera View */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Camera Feed</h2>
          
          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {simulationStatus?.isRunning ? (
              <div className="relative w-full h-full bg-gray-800">
                {/* Placeholder for camera feed */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <p className="text-center">
                    Simulation Camera Feed<br />
                    <span className="text-xs opacity-70">(Live feed will be integrated here)</span>
                  </p>
                </div>
                
                {/* Overlay with simulation data */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs">
                  <div className="flex justify-between">
                    <span>Speed: {simulationStatus.currentSpeed} mph</span>
                    <span>Status: ACTIVE</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Loc: {formatCoordinates(simulationStatus.currentLocation)}</span>
                    <span>Route: OPTIMAL</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                <Camera size={48} className="mx-auto opacity-30 mb-2" />
                <p className="text-center">Start the simulation to view the camera feed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
