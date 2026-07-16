/**
 * Hospitals.jsx  —  Hospital Finder page
 *
 * Flow:
 *  1. On mount → request browser geolocation
 *  2a. Granted  → call /api/hospitals/nearby with coords
 *  2b. Denied   → show manual city search → Nominatim geocode → same API call
 *  3. Render Leaflet map + scrollable list of Card components
 */
import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import 'leaflet/dist/leaflet.css';

// Lazy-load the map so Leaflet (which requires `window`) only runs client-side
const HospitalMap = lazy(() =>
  import('../../components/Map/HospitalMap')
);

// ── Constants ─────────────────────────────────────────────────────────────────
const DEFAULT_RADIUS = 5000; // metres

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ emergency }) =>
  emergency ? (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
      🚨 Emergency
    </span>
  ) : null;

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm animate-pulse">
    <div className="h-4 w-3/4 bg-slate-100 rounded mb-3" />
    <div className="h-3 w-1/2 bg-slate-100 rounded mb-2" />
    <div className="h-3 w-1/3 bg-slate-100 rounded mb-4" />
    <div className="h-9 w-32 bg-slate-100 rounded-xl" />
  </div>
);

const MapSkeleton = () => (
  <div className="flex items-center justify-center h-full bg-slate-50 rounded-3xl border border-slate-100 animate-pulse">
    <div className="text-slate-400 text-sm font-medium">Loading map…</div>
  </div>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Call Nominatim to geocode a free-text city/area query */
async function geocodeCity(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'HealthcareApp/1.0' },
  });
  if (!res.ok) throw new Error('Geocoding service unavailable');
  const results = await res.json();
  if (!results.length) throw new Error(`No location found for "${query}"`);
  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}

/** Fetch hospitals from our backend */
async function fetchHospitals(lat, lng, radius = DEFAULT_RADIUS) {
  const res = await fetch(
    `/api/hospitals/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch hospitals');
  return json.data;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const Hospitals = () => {
  // Location
  const [position, setPosition] = useState(null);        // { lat, lng }
  const [geoStatus, setGeoStatus] = useState('idle');    // idle | requesting | granted | denied | error

  // Search (manual fallback)
  const [cityQuery, setCityQuery] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');

  // Hospital data
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);           // user-adjustable (km)

  // UI
  const [activeHospital, setActiveHospital] = useState(null);
  const listRef = useRef(null);

  // ── Geolocation on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setGeoStatus('granted');
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      },
      () => setGeoStatus('denied'),
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // ── Reusable fetch function (called by useEffect AND the Retry button) ───────
  const loadHospitals = useCallback(async () => {
    if (!position) return;
    setLoading(true);
    setFetchError('');
    try {
      const data = await fetchHospitals(position.lat, position.lng, radiusKm * 1000);
      setHospitals(data.hospitals);
    } catch (err) {
      setFetchError(err.message);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [position, radiusKm]);

  // ── Fetch hospitals whenever position or radius changes ─────────────────────
  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  // ── Manual city search ──────────────────────────────────────────────────────
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!cityQuery.trim()) return;
    setGeocodeError('');
    setGeocoding(true);
    try {
      const coords = await geocodeCity(cityQuery.trim());
      setPosition(coords);
      setGeoStatus('granted');
    } catch (err) {
      setGeocodeError(err.message);
    } finally {
      setGeocoding(false);
    }
  };

  // ── Scroll list to active card ──────────────────────────────────────────────
  const handleMarkerClick = (hospital) => {
    setActiveHospital(hospital.id);
    const el = document.getElementById(`hospital-card-${hospital.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const openDirections = (h) =>
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`,
      '_blank',
      'noopener,noreferrer'
    );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-lightBg">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50 py-14 px-4">
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-sky-50 text-primary border border-blue-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Real-Time Hospital Locator
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-dark tracking-tight leading-tight">
            Find Hospitals <span className="text-primary">Near You</span>
          </h1>
          <p className="mt-4 text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Instantly locate verified hospitals in your area with live
            map markers, distances, and one-tap directions.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Controls row ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">

          {/* Status pill */}
          {geoStatus === 'requesting' && (
            <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Requesting location…
            </div>
          )}
          {geoStatus === 'granted' && position && (
            <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Location acquired ({position.lat.toFixed(4)}, {position.lng.toFixed(4)})
            </div>
          )}

          {/* Radius selector */}
          {position && (
            <div className="flex items-center gap-2 sm:ml-auto">
              <label className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                Search radius:
              </label>
              {[2, 5, 10, 20].map((km) => (
                <button
                  key={km}
                  id={`radius-btn-${km}`}
                  onClick={() => setRadiusKm(km)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                    radiusKm === km
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Manual location search (shown when denied OR as override) ──────── */}
        {(geoStatus === 'denied' || geoStatus === 'error' || geoStatus === 'granted') && (
          <form
            id="city-search-form"
            onSubmit={handleCitySearch}
            className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end max-w-lg"
          >
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 tracking-wide">
                {geoStatus === 'denied'
                  ? '📍 Location access denied — search by city or area'
                  : 'Search a different location'}
              </label>
              <input
                id="city-search-input"
                type="text"
                placeholder="e.g. Lahore, Karachi, London…"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-slate-400"
              />
            </div>
            <Button
              id="city-search-btn"
              type="submit"
              variant="primary"
              className="whitespace-nowrap"
            >
              {geocoding ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Searching…
                </span>
              ) : (
                'Search'
              )}
            </Button>
          </form>
        )}

        {geocodeError && (
          <div
            id="geocode-error"
            role="alert"
            className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm max-w-lg"
          >
            ⚠️ {geocodeError}
          </div>
        )}

        {/* ── Main content: map + list ────────────────────────────────────────── */}
        {position ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Map — takes 3/5 columns on large screens */}
            <div className="lg:col-span-3 h-[420px] sm:h-[500px] lg:h-[620px] rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <Suspense fallback={<MapSkeleton />}>
                <HospitalMap
                  userPosition={position}
                  hospitals={hospitals}
                  onHospitalClick={handleMarkerClick}
                />
              </Suspense>
            </div>

            {/* Hospital list — 2/5 columns */}
            <div
              ref={listRef}
              className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto lg:max-h-[620px] pr-1"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* List header */}
              <div className="flex items-center justify-between sticky top-0 bg-lightBg py-1 z-10">
                <h2 className="text-lg font-extrabold text-dark">
                  {loading
                    ? 'Finding hospitals…'
                    : `${hospitals.length} Hospital${hospitals.length !== 1 ? 's' : ''} Found`}
                </h2>
                {!loading && hospitals.length > 0 && (
                  <span className="text-xs text-slate-400 font-medium">
                    within {radiusKm} km
                  </span>
                )}
              </div>

              {/* Loading skeletons */}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

              {/* Fetch error */}
              {!loading && fetchError && (
                <div
                  id="fetch-error"
                  role="alert"
                  className="flex flex-col items-center py-12 text-center"
                >
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="font-bold text-dark mb-1">Couldn't load hospitals</p>
                  <p className="text-slate-500 text-sm mb-4">{fetchError}</p>
                  <Button
                    id="retry-btn"
                    variant="outline"
                    onClick={loadHospitals}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Empty state */}
              {!loading && !fetchError && hospitals.length === 0 && (
                <div id="no-hospitals" className="flex flex-col items-center py-12 text-center">
                  <div className="text-4xl mb-3">🏥</div>
                  <p className="font-bold text-dark mb-1">No hospitals found</p>
                  <p className="text-slate-500 text-sm">
                    Try increasing the search radius.
                  </p>
                </div>
              )}

              {/* Hospital cards */}
              {!loading &&
                hospitals.map((h) => (
                  <div
                    key={h.id}
                    id={`hospital-card-${h.id}`}
                    className="transition-transform duration-200"
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        activeHospital === h.id
                          ? 'ring-2 ring-primary border-primary'
                          : ''
                      }`}
                      hoverEffect={true}
                    >
                      {/* Hospital name & badges */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-extrabold text-dark leading-snug flex-1">
                          🏥 {h.name}
                        </h3>
                        <StatusBadge emergency={h.emergency} />
                      </div>

                      {/* Address */}
                      {h.address && (
                        <p className="text-xs text-slate-500 mb-1 leading-relaxed">
                          📌 {h.address}
                        </p>
                      )}

                      {/* Phone */}
                      {h.phone && (
                        <p className="text-xs text-slate-500 mb-1">
                          📞{' '}
                          <a
                            href={`tel:${h.phone}`}
                            className="text-primary hover:underline"
                          >
                            {h.phone}
                          </a>
                        </p>
                      )}

                      {/* Distance */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-primary font-extrabold text-sm">
                          {h.distanceKm} km away
                        </span>
                        <Button
                          id={`directions-btn-${h.id}`}
                          variant="outline"
                          className="text-xs px-3 py-1.5"
                          onClick={() => openDirections(h)}
                        >
                          Directions →
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* Waiting for geolocation / initial state */
          geoStatus === 'idle' || geoStatus === 'requesting' ? (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center text-4xl mb-5 animate-pulse">
                📍
              </div>
              <p className="text-dark font-bold text-lg mb-2">
                {geoStatus === 'requesting'
                  ? 'Waiting for location permission…'
                  : 'Detecting your location'}
              </p>
              <p className="text-slate-500 text-sm max-w-xs">
                Please allow location access in your browser when prompted.
              </p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Hospitals;
