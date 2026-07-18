import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const API_BASE_URL = 'http://localhost:5000/api';

const BookAppointment = () => {
  const { id } = useParams(); // doctor id
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    appointmentDate: '',
    timeSlot: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmed, setConfirmed] = useState(null); // holds the created appointment

  // Fetch the doctor so we can show their name/specialization and
  // use their real availableTimeSlots for the picker.
  useEffect(() => {
    const fetchDoctor = async () => {
      setLoadingDoctor(true);
      setDoctorError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
        if (!response.ok) throw new Error('Doctor not found');
        const result = await response.json();
        setDoctor(result.data);
      } catch (err) {
        setDoctorError('Could not load doctor details. Please go back and try again.');
      } finally {
        setLoadingDoctor(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Name is required';
    if (!formData.patientEmail.trim()) {
      errors.patientEmail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.patientEmail)) {
      errors.patientEmail = 'Enter a valid email';
    }
    if (!formData.patientPhone.trim()) errors.patientPhone = 'Phone number is required';
    if (!formData.appointmentDate) errors.appointmentDate = 'Please select a date';
    if (!formData.timeSlot) errors.timeSlot = 'Please select a time slot';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor: id, ...formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to book appointment');
      }

      setConfirmed(result.data);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-slate-400 font-medium">Loading...</p>
      </div>
    );
  }

  if (doctorError || !doctor) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">{doctorError}</p>
        <Button variant="outline" onClick={() => navigate('/doctors')}>
          Back to Doctors List
        </Button>
      </div>
    );
  }

  // Confirmation screen after successful booking
  if (confirmed) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="max-w-md w-full text-center animate-fade-in">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-extrabold text-dark mb-2">Appointment Confirmed</h1>
          <p className="text-slate-500 mb-6">
            Your appointment with <span className="font-semibold text-dark">{doctor.name}</span> has been booked.
          </p>

          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-left text-sm text-slate-700 mb-6 space-y-1">
            <p><span className="font-semibold">Date:</span> {new Date(confirmed.appointmentDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Time:</span> {confirmed.timeSlot}</p>
            <p><span className="font-semibold">Patient:</span> {confirmed.patientName}</p>
            <p><span className="font-semibold">Status:</span> {confirmed.status}</p>
          </div>

          <Button variant="primary" className="w-full" onClick={() => navigate('/doctors')}>
            Back to Doctors List
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Link
          to={`/doctors/${id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          ← Back to Profile
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark">Book Appointment</h1>
          <p className="mt-2 text-slate-500">
            with <span className="font-semibold text-dark">{doctor.name}</span> — {doctor.specialization}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.patientName}
              onChange={handleChange('patientName')}
            />
            {formErrors.patientName && (
              <p className="text-xs text-red-500 -mt-3">{formErrors.patientName}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.patientEmail}
                  onChange={handleChange('patientEmail')}
                />
                {formErrors.patientEmail && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.patientEmail}</p>
                )}
              </div>

              <div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={formData.patientPhone}
                  onChange={handleChange('patientPhone')}
                />
                {formErrors.patientPhone && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.patientPhone}</p>
                )}
              </div>
            </div>

            <div>
              <Input
                label="Appointment Date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.appointmentDate}
                onChange={handleChange('appointmentDate')}
              />
              {formErrors.appointmentDate && (
                <p className="text-xs text-red-500 mt-1">{formErrors.appointmentDate}</p>
              )}
            </div>

            {/* Time slot picker — built from the doctor's real availableTimeSlots */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 tracking-wide">
                Time Slot
              </label>
              <div className="flex flex-wrap gap-2">
                {(doctor.availableTimeSlots?.length
                  ? doctor.availableTimeSlots
                  : ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
                ).map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, timeSlot: slot }));
                      setFormErrors((prev) => ({ ...prev, timeSlot: null }));
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      formData.timeSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {formErrors.timeSlot && (
                <p className="text-xs text-red-500 mt-1">{formErrors.timeSlot}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 tracking-wide">
                Notes (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Anything the doctor should know beforehand..."
                value={formData.notes}
                onChange={handleChange('notes')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-slate-400 resize-none"
              />
            </div>

            {submitError && (
              <p className="text-sm text-red-500 text-center">{submitError}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className={`w-full mt-2 ${submitting ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;
