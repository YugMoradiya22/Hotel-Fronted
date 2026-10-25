import React from "react";
import Header2 from "./Header2";
import Footer from "./footer";
import { Link } from "react-router-dom";

export default function Services() {
  const servicesList = [
    {
      id: 1,
      title: "Michelin-Inspired Dining",
      description: "Experience world-class culinary creations crafted by master chefs using organic, farm-fresh ingredients.",
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Royal Wellness & Thermal Spa",
      description: "Rejuvenate body and mind with signature therapeutic treatments, sauna rituals, and private aroma baths.",
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Infinity Pool & Sky Lounge",
      description: "Bask under the sky in our heated rooftop infinity pool featuring private sun loungers and cocktail service.",
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "24/7 Bespoke Butler Service",
      description: "Dedicated personal concierge and in-suite dining around the clock to cater to your every request.",
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Executive Conference Halls",
      description: "State-of-the-art business facilities equipped with fiber optic Wi-Fi and premium audio-visual equipment.",
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Luxury Airport Chauffeur",
      description: "Seamless first-class transfers to and from the international airport in our private fleet of luxury vehicles.",
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header2 />

      {/* Hero Section */}
      <div className="relative py-20 bg-slate-900 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c59b27_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold font-sans">
            Tailored Experiences
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 tracking-tight">
            Our World-Class <span className="text-amber-400 italic">Services</span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Every service at RoyalPark is curated to ensure that your stay is effortless, enriching, and unforgettable.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 flex-grow pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-amber-600 flex flex-col justify-between"
            >
              <div>
                <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Section: Dining Highlight */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="w-full md:w-1/2 h-72 md:h-96">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Fine Dining at The Golden Plate" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2 block">Gastronomy</span>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">The Royal Dining Experience</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Join us at "The Sovereign Room," our award-winning in-house restaurant featuring curated pairing menus, private chef tastings, and cellar vintages.
              </p>
              <Link
                to="/rooms"
                className="inline-block bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Reserve Your Stay & Table
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}