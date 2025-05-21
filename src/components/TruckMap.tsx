import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface TruckMapProps {
  lat: number;
  lng: number;
  name: string;
  status: 'active' | 'maintenance' | 'idle';
}

// Function to determine color by status
const getMarkerColor = (status: string) => {
  switch (status) {
    case 'active': return 'green';
    case 'maintenance': return 'orange';
    case 'idle': return 'grey';
    default: return 'blue';
  }
};

const TruckMap: React.FC<TruckMapProps> = ({ lat, lng, name, status }) => {
  const color = getMarkerColor(status);

  const markerIcon = new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: markerShadow,
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      className="rounded-md h-40 w-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={[lat, lng]} icon={markerIcon}>
        <Popup>{name} ({status})</Popup>
      </Marker>
    </MapContainer>
  );
};

export default TruckMap;
