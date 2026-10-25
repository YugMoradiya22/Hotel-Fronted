import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Sparkles, Sun, ArrowRight } from 'lucide-react';

function Small() {
  const spaFeatures = [
    {
      icon: <Droplet size={20} />,
      title: "Vitality Thermal Pools",
      desc: "Hydrotherapy mineral pools heated to therapeutic temperatures for deep muscle release."
    },
    {
      icon: <Sparkles size={20} />,
      title: "Ayurvedic Herbal Healing",
      desc: "Custom herbal poultices and ancient chakra balancing rituals guided by master practitioners."
    },
    {
      icon: <Sun size={20} />,
      title: "Panoramic Infinity Sky Pool",
      desc: "Heated rooftop pool with unobstructed ocean sunset views and private VIP daybeds."
    },
    {
      icon: <Heart size={20} />,
      title: "Private Couples Pavilions",
      desc: "Secluded open-air treatment suites with private plunge baths and organic botanical tea service."
    }
  ];

  const stats = [
    { number: "150+", label: "Architectural Suites & Villas" },
    { number: "25+", label: "Years of Royal Distinction" },
    { number: "98.8%", label: "Verified 5-Star Guest Satisfaction" },
    { number: "100%", label: "Organic Botanicals & Clean Energy" }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold block mb-2 font-sans">
              Holistic Renewal
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-tight">
              The Lotus Thermal Spa & <br />
              <span className="text-amber-600 italic font-serif">Rooftop Vitality Oasis</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs uppercase tracking-wider transition-all duration-300"
            >
              <span>Explore Wellness Menu</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Spa Grid: Photo Left + Features Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          <div className="lg:col-span-6 h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl relative group">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=85"
              alt="Lotus Thermal Spa Vitality Pool"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Restorative Sanctuary</span>
              <p className="text-xl font-serif font-bold">The Oceanfront Hydrotherapy Deck</p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {spaFeatures.map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-base mb-1.5">{feat.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Integrated Luxury Numbers Strip */}
        <div className="pt-12 border-t border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <p className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 mb-1">{s.number}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Small;