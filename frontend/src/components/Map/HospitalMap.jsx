/**
 * HospitalMap.jsx
 * Leaflet map showing the user's position and nearby hospital markers.
 * Imported lazily in Hospitals.jsx to avoid SSR issues with the window object.
 */
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// ── Fix Leaflet's broken default icon paths when bundled with Vite ──────────
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ── Custom coloured marker factories ────────────────────────────────────────
const makeIcon = (color) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        width:32px;height:32px;
        background:${color};
        border:3px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(0,0,0,.35);
      "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });

const hospitalIcon = makeIcon('#0EA5E9'); // sky-blue  – hospital
const userIcon = makeIcon('#10B981');     // emerald   – you are here

// ── Helper: re-centre map when centre prop changes ───────────────────────────
const RecenterOnChange = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};

// ── Main component ───────────────────────────────────────────────────────────
const HospitalMap = ({ userPosition, hospitals, onHospitalClick }) => {
  const center = [userPosition.lat, userPosition.lng];

  const openDirections = (h) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterOnChange center={center} />

      {/* User position marker */}
      <Marker position={center} icon={userIcon}>
        <Popup>
          <div style={{ textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>
            📍 You are here
          </div>
        </Popup>
      </Marker>

      {/* Hospital markers */}
      {hospitals.map((h) => (
        <Marker
          key={h.id}
          position={[h.lat, h.lng]}
          icon={hospitalIcon}
          eventHandlers={{
            click: () => onHospitalClick && onHospitalClick(h),
          }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                🏥 {h.name}
              </p>
              {h.address && (
                <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 4px' }}>
                  {h.address}
                </p>
              )}
              <p style={{ color: '#0EA5E9', fontWeight: 600, fontSize: 13, margin: '0 0 8px' }}>
                {h.distanceKm} km away
              </p>
              <button
                onClick={() => openDirections(h)}
                style={{
                  background: '#0EA5E9',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '5px 12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  width: '100%',
                }}
              >
                Get Directions →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default HospitalMap;
