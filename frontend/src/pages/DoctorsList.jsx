import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

// Dummy data for now — will be replaced with a GET /api/doctors call
// once the backend controller + MongoDB connection are ready (Day 4).
const dummyDoctors = [
  {
    id: 1,
    name: 'Dr. Ayesha Khan',
    specialization: 'Cardiologist',
    qualification: 'MBBS, FCPS (Cardiology)',
    experience: 8,
    rating: 4.8,
    profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 2,
    name: 'Dr. Bilal Ahmed',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 5,
    rating: 4.6,
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    name: 'Dr. Sana Malik',
    specialization: 'Pediatrician',
    qualification: 'MBBS, FCPS (Pediatrics)',
    experience: 10,
    rating: 4.9,
    profileImage: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    id: 4,
    name: 'Dr. Usman Tariq',
    specialization: 'Orthopedic Surgeon',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 12,
    rating: 4.7,
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 5,
    name: 'Dr. Hina Raza',
    specialization: 'Cardiologist',
    qualification: 'MBBS, FCPS (Cardiology)',
    experience: 6,
    rating: 4.5,
    profileImage: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
  {
    id: 6,
    name: 'Dr. Omar Farooq',
    specialization: 'Neurologist',
    qualification: 'MBBS, FCPS (Neurology)',
    experience: 9,
    rating: 4.8,
    profileImage: 'https://randomuser.me/api/portraits/men/60.jpg',
  },
];

const specializations = [
  'All',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Neurologist',
];

const DoctorsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const filteredDoctors = dummyDoctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

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

        {/* Doctors grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="flex flex-col items-center text-center">
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 mb-4"
                />
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-600 mb-3">
                  {doctor.specialization}
                </span>
                <h3 className="text-lg font-bold text-dark">{doctor.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{doctor.qualification}</p>

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
                  onClick={() => alert(`Navigating to ${doctor.name}'s profile...`)}
                >
                  View Profile
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 font-medium">
            No doctors found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
