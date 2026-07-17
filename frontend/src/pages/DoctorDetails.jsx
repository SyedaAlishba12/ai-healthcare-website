import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const API_BASE_URL = 'http://localhost:5000/api';

// Placeholder reviews until the Reviews module (Review.js / reviewController.js)
// is wired up by whoever owns that part of the project.
const dummyReviews = [
  {
    id: 1,
    patientName: 'Ahmed R.',
    rating: 5,
    comment: 'Very thorough and explained everything clearly. Highly recommend.',
  },
  {
    id: 2,
    patientName: 'Fatima S.',
    rating: 4,
    comment: 'Professional and punctual. Wait time was a bit long though.',
  },
  {
    id: 3,
    patientName: 'Zubair K.',
    rating: 5,
    comment: 'Best experience I have had with a specialist in years.',
  },
];

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`);

        if (!response.ok) {
          throw new Error('Doctor not found');
        }

        const result = await response.json();
        setDoctor(result.data);
      } catch (err) {
        setError('Could not load this doctor. They may not exist, or the backend server is not running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-slate-400 font-medium">Loading doctor profile...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <Button variant="outline" onClick={() => navigate('/doctors')}>
          Back to Doctors List
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto animate-fade-in">
        {/* Back link */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          ← Back to Doctors
        </Link>

        {/* Profile header */}
        <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
          <img
            src={doctor.profileImage}
            alt={doctor.name}
            className="w-36 h-36 rounded-full object-cover border-4 border-blue-50 shrink-0"
          />

          <div className="flex-1 text-center sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-600 mb-3">
              {doctor.specialization}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark">{doctor.name}</h1>
            <p className="text-slate-500 mt-1">{doctor.qualification}</p>

            <div className="flex items-center justify-center sm:justify-start gap-6 mt-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                ⭐ <span className="font-semibold">{doctor.rating}</span> rating
              </span>
              <span className="flex items-center gap-1">
                🩺 <span className="font-semibold">{doctor.experience} yrs</span> experience
              </span>
            </div>

            <Button
              variant="primary"
              className="mt-6 w-full sm:w-auto"
              onClick={() => alert(`Booking flow for ${doctor.name} coming soon...`)}
            >
              Book Appointment
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <h2 className="text-lg font-bold text-dark mb-3">About</h2>
          <p className="text-slate-700 leading-relaxed">{doctor.bio}</p>
        </Card>

        {/* Availability */}
        <Card className="mb-8">
          <h2 className="text-lg font-bold text-dark mb-4">Availability</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {doctor.availableDays?.map((day) => (
                  <span
                    key={day}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-primary-dark"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Time Slots</p>
              <div className="flex flex-wrap gap-2">
                {doctor.availableTimeSlots?.map((slot) => (
                  <span
                    key={slot}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-100"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews (placeholder until Reviews module is connected) */}
        <Card>
          <h2 className="text-lg font-bold text-dark mb-4">Patient Reviews</h2>

          <div className="flex flex-col gap-4">
            {dummyReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-slate-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-dark text-sm">{review.patientName}</span>
                  <span className="text-xs text-slate-500">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDetails;