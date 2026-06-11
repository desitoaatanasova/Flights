import { Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';

const STATUS_COLORS = {
  active: '#22C55E',
  scheduled: '#3B82F6',
  landed: '#6B7280',
  delayed: '#F59E0B',
  cancelled: '#EF4444',
};

function computeBezier([lat1, lng1], [lat2, lng2], numPoints = 50) {
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);

  // Bulge perpendicular to the line, proportional to distance
  const offset = Math.max(dist * 0.35, 0.3);
  const perpLat = -dLng / dist;
  const perpLng = dLat / dist;

  const midLat = (lat1 + lat2) / 2 + perpLat * offset;
  const midLng = (lng1 + lng2) / 2 + perpLng * offset;

  const pts = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const u = 1 - t;
    pts.push([
      u * u * lat1 + 2 * u * t * midLat + t * t * lat2,
      u * u * lng1 + 2 * u * t * midLng + t * t * lng2,
    ]);
  }
  return pts;
}

function arrowIcon(color, angleDeg) {
  return L.divIcon({
    className: '',
    html: `<svg width="14" height="14" viewBox="0 0 14 14" style="transform:rotate(${angleDeg}deg);display:block;">
      <polygon points="7,0 14,14 0,14" fill="${color}" opacity="0.7" />
    </svg>`,
    iconSize: [14, 14],
    iconAnchor: [7, 0],
  });
}

export default function RouteArc({ from, to, status }) {
  const color = STATUS_COLORS[status?.toLowerCase()] || '#6366F1';
  const points = computeBezier(from, to);

  const last = points.at(-1);
  const prev = points.at(-2);
  const angle = Math.atan2(last[0] - prev[0], last[1] - prev[1]) * (180 / Math.PI);

  return (
    <>
      <Polyline
        positions={points}
        pathOptions={{ color, weight: 2.5, opacity: 0.5 }}
      />
      <Marker position={to} icon={arrowIcon(color, angle)} />
    </>
  );
}
