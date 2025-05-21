import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon paths for Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

interface LocationPickerProps {
  label: string;
  coords: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
  address?: string;
}

const LocationMarker: React.FC<Pick<LocationPickerProps, 'coords' | 'onChange'>> = ({
  coords,
  onChange
}) => {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });

  return <Marker position={[coords.lat, coords.lng]} />;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ label, coords, onChange, address }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="rounded-lg border h-[300px] overflow-hidden">
        <MapContainer
          center={[coords.lat, coords.lng] as [number, number]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <LocationMarker coords={coords} onChange={onChange} />
        </MapContainer>
      </div>
      {address && (
        <p className="text-xs text-gray-500 mt-1 italic">📍 {address}</p>
      )}
    </div>
  );
};

export default LocationPicker;
