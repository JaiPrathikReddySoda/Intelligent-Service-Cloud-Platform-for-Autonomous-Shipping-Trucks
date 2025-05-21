// ScheduleMap.tsx
import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const startIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
  iconSize: [32, 32],
});

const endIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
  iconSize: [32, 32],
});

const maintenanceIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png',
  iconSize: [32, 32],
});

interface ScheduleMapProps {
  type: 'delivery' | 'maintenance';
  start?: { lat: number; lng: number };
  end?: { lat: number; lng: number };
  location?: { lat: number; lng: number };
}

const RouteDrawer: React.FC<{ start: L.LatLngExpression; end: L.LatLngExpression }> = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: '#3388ff', weight: 4 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      routeWhileDragging: false,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [start, end, map]);

  return null;
};

const ScheduleMap: React.FC<ScheduleMapProps> = ({ type, start, end, location }) => {
  const center =
    type === 'maintenance' && location
      ? location
      : start || { lat: 37.3382, lng: -121.8863 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      style={{ height: 200, width: '100%' }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {type === 'delivery' && start && end && (
        <>
          <Marker position={[start.lat, start.lng]} icon={startIcon}>
            <Tooltip permanent>Start</Tooltip>
          </Marker>
          <Marker position={[end.lat, end.lng]} icon={endIcon}>
            <Tooltip permanent>End</Tooltip>
          </Marker>
          <RouteDrawer start={[start.lat, start.lng]} end={[end.lat, end.lng]} />
        </>
      )}

      {type === 'maintenance' && location && (
        <Marker position={[location.lat, location.lng]} icon={maintenanceIcon}>
          <Tooltip permanent>Maintenance</Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
};

export default ScheduleMap;
