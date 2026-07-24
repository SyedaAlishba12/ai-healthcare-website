import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

import { getDoctors } from "../services/doctorService";

const specializations = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Neurologist",
];

const DoctorsList = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDoctors();
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm, selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedSpecialization !== "All") {
        params.specialization = selectedSpecialization;
      }

      const result = await getDoctors(params);

      setDoctors(result.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to load doctors. Please make sure the backend server is running."
      );

      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-dark">
            Find Your Doctor
          </h1>

          <p className="mt-3 text-slate-500">
            Search and book appointments with experienced specialists.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-10 flex flex-col md:flex-row gap-5">

          <Input
            label="Search Doctor"
            placeholder="Search by doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />

          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Specialization
            </label>

            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-slate-500">
            Loading doctors...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20 text-red-500">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No doctors found.
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && !error && doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {doctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="flex flex-col items-center text-center"
              >

                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 mb-4"
                />

                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700 mb-3">
                  {doctor.specialization}
                </span>

                <h3 className="text-xl font-bold text-dark">
                  {doctor.name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {doctor.qualification}
                </p>

                <div className="flex gap-6 mt-4 text-sm">
                  <span>⭐ {doctor.rating}</span>
                  <span>🩺 {doctor.experience} yrs</span>
                </div>

                <Button
                  variant="primary"
                  className="w-full mt-6"
                  onClick={() => navigate(`/doctors/${doctor._id}`)}
                >
                  View Profile
                </Button>

              </Card>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorsList;