import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

// Backend base URL — matches the Express server started with `node server.js`.
// TODO: move this to an environment variable (VITE_API_URL) before deployment.
const API_BASE_URL = 'http://localhost:5000/api';

const specializations = [
  'All',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Neurologist',
];

const DoctorsList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedSpecialization && selectedSpecialization !== 'All') {
          params.append('specialization', selectedSpecialization);
        }

        const response = await fetch(`${API_BASE_URL}/doctors?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const result = await response.json();
        setDoctors(result.data || []);
      } catch (err) {
        setError(
          'Could not load doctors. Make sure the backend server is running on port 5000.'
        );
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    // Small debounce so we don't fire a request on every keystroke
    const timeoutId = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSpecialization]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Find Your Doctor
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            Search and filter through our network of specialist doctors and
            book an appointment in minutes.
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-10 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <Input
              label="Search Doctor"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-64 flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 tracking-wide">
              Specialization
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20 text-slate-400 font-medium">
            Loading doctors...
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-20 text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* Doctors grid */}
        {!loading && !error && (
          doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
                >
                <Card className="flex flex-col items-center text-center">
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 mb-4"
                  />
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-600 mb-3">
                    {doctor.specialization}
                  </span>
                  <h3 className="text-lg font-bold text-dark truncate max-w-full px-2">{doctor.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 truncate max-w-full px-2">{doctor.qualification}</p>

                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      ⭐ <span className="font-semibold">{doctor.rating}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      🩺 <span className="font-semibold">{doctor.experience} yrs</span>
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full mt-6"
                    onClick={() => navigate(`/doctors/${doctor._id}`)}
                  >
                    View Profile
                  </Button>
                </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 font-medium">
              No doctors found matching your search.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
