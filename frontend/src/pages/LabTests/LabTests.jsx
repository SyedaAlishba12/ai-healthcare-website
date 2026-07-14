import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Today in YYYY-MM-DD (local time), used as min attr on the date picker */
const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/** Category → colour accent (Tailwind) */
const categoryColour = (cat = '') => {
  const map = {
    Haematology: 'bg-rose-50 text-rose-600',
    Biochemistry: 'bg-amber-50 text-amber-600',
    Microbiology: 'bg-emerald-50 text-emerald-600',
    Immunology: 'bg-violet-50 text-violet-600',
    Radiology: 'bg-sky-50 text-sky-600',
    Cardiology: 'bg-pink-50 text-pink-600',
  };
  return map[cat] || 'bg-slate-50 text-slate-600';
};

// ─── Booking Modal ───────────────────────────────────────────────────────────

const BookingModal = ({ test, onClose }) => {
  const [form, setForm] = useState({
    patientName: '',
    email: '',
    phone: '',
    preferredDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);  // confirmation object
  const [error, setError] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/lab-tests/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, testId: test._id }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.message || 'Booking failed. Please try again.');
      } else {
        setSuccess(json.data);
      }
    } catch {
      setError('Network error — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      id="booking-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target.id === 'booking-modal-backdrop') onClose(); }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in"
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Decorative top bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                Lab Test Booking
              </p>
              <h2 id="modal-title" className="text-xl font-extrabold text-dark leading-tight">
                {test.name}
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColour(test.category)}`}>
                  {test.category}
                </span>
                <span className="text-sm font-bold text-secondary">
                  Rs. {test.price.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              id="modal-close-btn"
              onClick={onClose}
              aria-label="Close booking modal"
              className="ml-4 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          {/* ── Success State ── */}
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-3xl">
                ✅
              </div>
              <h3 className="text-lg font-extrabold text-dark mb-2">Booking Confirmed!</h3>
              <p className="text-slate-500 text-sm mb-6">
                Your appointment has been successfully scheduled.
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 mb-6 text-sm">
                <ConfirmRow label="Booking ID" value={`#${success.bookingId.slice(-8).toUpperCase()}`} />
                <ConfirmRow label="Patient" value={success.patientName} />
                <ConfirmRow label="Test" value={success.testName} />
                <ConfirmRow
                  label="Date"
                  value={new Date(success.preferredDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                />
                <ConfirmRow label="Status" value={
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    {success.status.charAt(0).toUpperCase() + success.status.slice(1)}
                  </span>
                } />
              </div>
              <Button id="modal-done-btn" onClick={onClose} variant="primary" className="w-full">
                Done
              </Button>
            </div>
          ) : (
            /* ── Form State ── */
            <form id="booking-form" onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <Input
                  id="input-patient-name"
                  label="Patient Name"
                  placeholder="e.g. Sara Ahmed"
                  value={form.patientName}
                  onChange={handleChange('patientName')}
                  required
                />
                <Input
                  id="input-email"
                  label="Email Address"
                  type="email"
                  placeholder="e.g. sara@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
                <Input
                  id="input-phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. 0300-1234567"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  required
                />
                <Input
                  id="input-preferred-date"
                  label="Preferred Date"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange('preferredDate')}
                  min={todayISO()}
                  required
                />
              </div>

              {/* Error banner */}
              {error && (
                <div
                  id="booking-error-banner"
                  role="alert"
                  className="mt-4 flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm"
                >
                  <span className="mt-0.5 flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  id="submit-booking-btn"
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Booking…
                    </span>
                  ) : 'Confirm Booking'}
                </Button>
                <Button
                  id="cancel-booking-btn"
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/** Small label + value row used in the confirmation card */
const ConfirmRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-2">
    <span className="text-slate-400 shrink-0">{label}</span>
    <span className="text-dark font-semibold text-right">{value}</span>
  </div>
);

// ─── Lab Test Card ───────────────────────────────────────────────────────────

const LabTestCard = ({ test, onBook }) => (
  <Card className="flex flex-col justify-between h-full">
    {/* Category pill */}
    <div className="mb-4">
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColour(test.category)}`}>
        {test.category}
      </span>
    </div>

    {/* Test icon */}
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-2xl mb-4">
      🧪
    </div>

    {/* Name & description */}
    <h3 className="text-base font-extrabold text-dark mb-1 leading-snug">{test.name}</h3>
    {test.description && (
      <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3">
        {test.description}
      </p>
    )}

    {/* Price + CTA */}
    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
      <span className="text-lg font-extrabold text-primary">
        Rs. {test.price.toLocaleString()}
      </span>
      <Button
        id={`book-btn-${test._id}`}
        variant="primary"
        onClick={() => onBook(test)}
        className="text-sm px-4 py-2"
      >
        Book Test
      </Button>
    </div>
  </Card>
);

// ─── Skeleton loader ─────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm animate-pulse">
    <div className="h-5 w-20 bg-slate-100 rounded-full mb-4" />
    <div className="h-12 w-12 bg-slate-100 rounded-2xl mb-4" />
    <div className="h-5 w-3/4 bg-slate-100 rounded mb-2" />
    <div className="h-3 w-full bg-slate-100 rounded mb-1" />
    <div className="h-3 w-5/6 bg-slate-100 rounded mb-4" />
    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
      <div className="h-6 w-20 bg-slate-100 rounded" />
      <div className="h-9 w-24 bg-slate-100 rounded-xl" />
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const LabTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/lab-tests');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setTests(json.data);
    } catch (err) {
      setFetchError(err.message || 'Failed to load lab tests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  // Filtered list based on search
  const filtered = tests.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-lightBg">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-16 px-4">
        {/* Blurred orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-sky-50 text-primary border border-blue-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Diagnostic Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-dark tracking-tight leading-tight">
            Lab Tests &amp; <span className="text-primary">Diagnostics</span>
          </h1>
          <p className="mt-4 text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Browse accredited diagnostic tests, check prices, and schedule
            a home or clinic appointment — all in one place.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto">
            <Input
              id="search-tests"
              label=""
              placeholder="Search by test name or category…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-white border-y border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🧬', value: `${tests.length}+`, label: 'Available Tests' },
            { icon: '⚡', value: '24hr', label: 'Report Turnaround' },
            { icon: '🏥', value: '100%', label: 'Accredited Labs' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl sm:text-2xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tests Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-dark">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : 'All Available Tests'}
            </h2>
            {!loading && (
              <p className="text-slate-500 text-sm mt-1">
                {filtered.length} {filtered.length === 1 ? 'test' : 'tests'} found
              </p>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Fetch error */}
        {!loading && fetchError && (
          <div
            id="fetch-error-message"
            role="alert"
            className="flex flex-col items-center py-20 text-center"
          >
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-dark font-bold mb-2">Something went wrong</p>
            <p className="text-slate-500 text-sm mb-6">{fetchError}</p>
            <Button id="retry-btn" variant="outline" onClick={fetchTests}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && filtered.length === 0 && (
          <div id="empty-state" className="flex flex-col items-center py-20 text-center">
            <div className="text-5xl mb-4">🔬</div>
            <p className="text-dark font-bold mb-2">No tests found</p>
            <p className="text-slate-500 text-sm">
              {searchQuery
                ? 'Try a different search term.'
                : 'No lab tests available at the moment.'}
            </p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !fetchError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((test) => (
              <LabTestCard
                key={test._id}
                test={test}
                onBook={setSelectedTest}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Booking Modal ── */}
      {selectedTest && (
        <BookingModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
    </div>
  );
};

export default LabTests;
