import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import frontimage from '../assets/frontimage.jpg';

const Front = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = featuresRef.current;
      const ctaSection = ctaRef.current;

      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setFeaturesVisible(true);
        }
      }

      if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setCtaVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: '1. User Authentication',
      items: [
        'User registration and login',
        'Secure password storage and authentication',
      ],
    },
    {
      title: '2. Profile Management',
      items: [
        'Job seeker profiles with personal information, resume upload, and skills',
        'Employer profiles with company information and contact details',
      ],
    },
    {
      title: '3. Job Listings',
      items: [
        'Employers can create, edit, and delete job listings',
        'Job listings include job title, description, qualifications, responsibilities, location, and salary range',
      ],
    },
    {
      title: '4. Job Search',
      items: [
        'Simple search functionality for job seekers to find job listings',
        'Basic search filters such as job type, location, and keywords',
      ],
    },
    {
      title: '5. Job Application',
      items: [
        'Job seekers can apply for jobs directly through the portal',
        'Employers can view applications and manage candidates',
      ],
    },
    {
      title: '6. Dashboard',
      items: [
        'Separate dashboards for job seekers and employers',
        'Job seekers can track applied jobs and update profiles',
        'Employers can manage job listings and view applications',
      ],
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="TalentBridge Logo" className="h-10 w-10 mr-2" />
            <span className="font-bold text-xl">TalentBridge</span>
          </div>
          <div className="flex items-center">
            <button
              className="px-4 py-2 text-gray-600 hover:text-blue-500"
              onClick={() => navigate('/auth')}
            >
              Login
            </button>
            <button
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => navigate('/auth')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Connect Talent with Opportunity</h1>
            <p className="text-lg text-gray-600">
              Empowering job seekers and employers through an intelligent, seamless platform that transforms the hiring experience.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src={frontimage}
              alt="Job Portal Hero" 
              className="rounded-lg shadow-2xl"
              style={{
                objectFit: 'cover',
                width: '100%',
                maxWidth: '600px',
                height: '500px'
              }}
            />
          </div>
        </div>
      </section>

      <section ref={featuresRef} className={`py-20 bg-white transition-opacity duration-1000 ${featuresVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className={`py-20 relative overflow-hidden transition-opacity duration-1000 ${ctaVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative">
          <div className="text-5xl mb-4">📈</div>
          <h2 className="text-3xl font-bold mb-2">Ready to Transform Your Career?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of professionals finding their perfect match
          </p>
          <button 
            className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/auth')}
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  );
};

export default Front;
