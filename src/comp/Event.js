import React from "react";
import '../Componentcss/Event.css';
import { useNavigate } from "react-router-dom";

function Events() {
  const navigate = useNavigate();

  const eventData = [
    {
      id: 1,
      title: "Dream Weddings",
      desc: "Create unforgettable memories with our bespoke wedding packages, featuring grand ballrooms, crystal chandeliers, and exquisite catering.",
      capacity: "Up to 500 Guests",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Corporate Summits",
      desc: "Elevate your business gatherings with our state-of-the-art conference halls, high-speed fiber amenities, and dedicated technical concierge.",
      capacity: "10 - 250 Guests",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Private Celebrations",
      desc: "From milestone birthdays to anniversary galas, our versatile open-air terraces and intimate lounges set the perfect stage.",
      capacity: "Up to 150 Guests",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handlePlanEvent = (title) => {
    navigate("/contact", { state: { subject: `Event Inquiry: ${title}` } });
  };

  return (
    <section className="evt-section">
      <div className="evt-container">
        
        {/* Header */}
        <div className="evt-header text-center">
          <p className="evt-tag tracking-widest text-xs uppercase font-bold text-amber-500">CELEBRATE WITH US</p>
          <h2 className="evt-title font-serif text-3xl md:text-4xl text-white">Events & <span className="evt-gold text-amber-400 italic">Conferences</span></h2>
          <p className="evt-subtitle text-slate-300 max-w-xl mx-auto text-sm mt-2">
            Experience flawless planning, bespoke catering, and world-class service for gatherings that matter.
          </p>
        </div>

        {/* Grid */}
        <div className="evt-grid mt-10">
          {eventData.map((item) => (
            <div key={item.id} className="evt-card group rounded-2xl overflow-hidden shadow-xl">
              
              {/* Image Layer */}
              <div className="evt-img-wrapper h-64 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="evt-img w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="evt-overlay absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
              </div>

              {/* Content Layer */}
              <div className="evt-content p-6 bg-slate-900 text-white">
                <div className="evt-capacity-badge inline-block text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md mb-2">
                  {item.capacity}
                </div>
                <h3 className="evt-card-title font-serif text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="evt-card-desc text-slate-300 text-xs leading-relaxed mb-4">{item.desc}</p>
                <button 
                  onClick={() => handlePlanEvent(item.title)} 
                  className="evt-btn-arrow text-xs uppercase font-bold tracking-wider text-amber-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer bg-transparent border-0"
                >
                  Plan Event &rarr;
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Events;