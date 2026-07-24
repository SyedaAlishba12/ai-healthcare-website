import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

// Custom Hook for Counter Animation
const useCountUp = (target, start, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    let startTime = null;
    const animateCount = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animateCount);
  }, [target, start, duration]);

  return count;
};

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  // Fetch Featured Doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctors');
        const result = await response.json();
        if (response.ok && result.success) {
          setDoctors(result.data.slice(0, 4)); // Top 4 doctors
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Scroll Animation Trigger for Stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  const statsData = [
    { label: 'Verified Medicines', value: 15000, suffix: '+' },
    { label: 'Specialist Doctors', value: 450, suffix: '+' },
    { label: 'Emergency Support', value: 24, suffix: '/7' },
    { label: 'Secure Records', value: 100, suffix: '%' }
  ];

  const services = [
    { title: 'Find Doctors', desc: 'Book appointments with top specialists across various fields.', path: '/doctors', icon: '👨‍⚕️' },
    { title: 'Medicine Store', desc: 'Order prescribed medicines online and get them delivered.', path: '/medicines', icon: '💊' },
    { title: 'Lab Tests', desc: 'Book diagnostic lab tests at discounted rates from certified labs.', path: '/lab-tests', icon: '🧪' },
    { title: 'Emergency Services', desc: 'Quick access to ambulance, blood banks, and hospital numbers.', path: '/emergency', icon: '🚑' },
  ];

  const testimonials = [
    { name: 'Ahmed Raza', role: 'Patient', text: 'Booked an appointment in seconds and got my medicines delivered the same day. HealthPulse made healthcare incredibly easy!', rating: 5 },
    { name: 'Sara Khan', role: 'Patient', text: 'The AI chatbot helped me find the right specialist for my symptoms. The whole process was smooth and professional.', rating: 5 },
    { name: 'Bilal Sheikh', role: 'Patient', text: 'Used the emergency contacts feature during a crisis. Having all hospital numbers in one place was a lifesaver.', rating: 4.5 },
  ];

  return (
    <div className="bg-lightBg">
      {/* ==========================================
          1. HERO SECTION
      ========================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-lightBg pb-24 pt-16">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            The Ultimate AI-Powered Patient Portal
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-dark sm:text-5xl lg:text-6xl">
            Revolutionizing Healthcare with{" "}
            <span className="text-primary">Smart Digital Care</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Your comprehensive medical interface. Book clinical specialist appointments, access real-time emergency desks, and order medications securely.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/medicines">
              <Button variant="primary">Explore Medicines</Button>
            </Link>
            <Link to="/emergency">
              <Button variant="outline">View Emergency Hotlines</Button>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[300px] w-[1000px] -translate-x-1/2 bg-gradient-to-b from-blue-100/30 to-transparent blur-3xl" />
      </section>

      {/* ==========================================
          2. HEALTH STATISTICS (COUNTER)
      ========================================== */}
      <section ref={statsRef} className="border-y border-slate-100 bg-white py-12 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <Counter key={index} target={stat.value} suffix={stat.suffix} label={stat.label} start={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SERVICES SECTION
      ========================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark">
            Explore Our Core Health Modules
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
            Access our main healthcare services, including doctor appointments, medicines, and emergency support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Link to={service.path} key={index} className="card-zoom rounded-3xl border border-slate-100 bg-white p-8 shadow-sm block">
              <div className="mb-4 text-4xl">{service.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-dark">{service.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">{service.desc}</p>
              <div className="text-primary font-bold text-sm">Learn More →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. FEATURED DOCTORS SECTION
      ========================================== */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">Featured Doctors</h2>
              <p className="mt-3 text-slate-500">Meet our top-rated medical specialists ready to assist you.</p>
            </div>
            <Link to="/doctors" className="mt-4 sm:mt-0">
              <Button variant="outline">View All Doctors</Button>
            </Link>
          </div>

          {loadingDoctors ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor._id} className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-4 overflow-hidden">
                    {doctor.profileImage ? (
                      <img src={doctor.profileImage} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      '👨‍⚕️'
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-dark">Dr. {doctor.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-2">{doctor.specialization}</p>
                  <p className="text-xs text-slate-400 mb-4">{doctor.experience}+ Years Experience</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-secondary font-bold text-sm">★ {doctor.rating.toFixed(1)}</span>
                  </div>

                  <Link to={`/doctors/${doctor._id}`}>
                    <Button variant="primary" className="w-full text-sm py-2">View Profile</Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          5. TESTIMONIALS SECTION
      ========================================== */}
      <section className="py-20 bg-lightBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">What Our Patients Say</h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">Real experiences from people who used our platform to manage their health.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <div className="flex mb-4 text-secondary">
                  {'★'.repeat(Math.floor(testimonial.rating))}
                  {testimonial.rating % 1 !== 0 && '½'}
                </div>
                <p className="text-slate-600 leading-relaxed italic mb-6 flex-grow">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. CTA SECTION
      ========================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-dark text-center p-10 sm:p-16 border-none hoverEffect={false}">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Experience Smart Healthcare Today
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join HealthPulse today and take control of your medical needs with just a few clicks.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" className="px-8 py-3 text-base">Get Started Now</Button>
              </Link>
              <Link to="/emergency">
                <Button variant="danger" className="px-8 py-3 text-base">Emergency Help</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

// Counter Component
const Counter = ({ target, suffix, label, start }) => {
  const count = useCountUp(target, start);

  return (
    <div className="p-4">
      <div className="text-3xl font-extrabold text-primary sm:text-4xl">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
        {label}
      </div>
    </div>
  );
};

export default Home;