import React from 'react';
import Header2 from './Header2';
import Footer from './footer';
import '../Componentcss/AboutusPage.css';
import '../Componentcss/About.css';

function AboutPage() {
  const teamMembers = [
    {
      id: 1,
      name: "James Anderson",
      role: "General Manager & Sommelier",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Chef Sarah Williams",
      role: "Executive Head Chef",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Director of Guest Experiences",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="about-page-container min-h-screen flex flex-col bg-slate-50">
      <Header2 />

      {/* --- HERO BANNER --- */}
      <div className="abt-hero relative">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Hotel Lobby" 
          className="abt-hero-img"
        />
        <div className="abt-hero-overlay">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold block mb-2">
            The Royal Heritage
          </span>
          <h1 className="abt-hero-title font-serif">About RoyalPark</h1>
        </div>
      </div>

      {/* --- OUR HERITAGE SECTION --- */}
      <div className="abt-heritage-section py-16">
        <div className="abt-grid max-w-6xl mx-auto px-4">
          
          {/* Text Content */}
          <div className="abt-text-content">
            <p className="abt-tag text-xs font-bold uppercase tracking-widest text-amber-600">SINCE 1998</p>
            <h2 className="abt-heading font-serif text-3xl md:text-4xl">
              Redefining Luxury & <br/> <span className="abt-gold-text text-amber-600 italic">Hospitality.</span>
            </h2>
            <p className="abt-desc text-slate-600 leading-relaxed mt-4">
              RoyalPark began with a timeless vision: to create a private sanctuary where modern architectural elegance meets the warmth of personalized hospitality. Over the last two decades, we have evolved into a distinguished destination hosting travelers from across the globe.
            </p>
            <p className="abt-desc text-slate-600 leading-relaxed mt-3">
              We believe a stay should be transformative—whether it is tasting culinary creations from our Michelin-trained chefs, relaxing in our holistic thermal spa, or simply watching the sunset from your private terrace.
            </p>
          </div>

          {/* Image Grid */}
          <div className="abt-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Hotel Interior" 
              className="abt-interior-img shadow-xl rounded-2xl"
            />
            <div className="abt-stat-box shadow-lg">
              <p className="abt-stat-number font-serif">25+</p>
              <p className="abt-stat-label">Years of Distinction</p>
            </div>
          </div>

        </div>
      </div>

      {/* --- TEAM SECTION --- */}
      <div className="abt-team-section py-16 bg-white border-t border-slate-100 flex-grow">
        <div className="abt-container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold block mb-2">Leadership</span>
            <h2 className="abt-section-title font-serif text-3xl md:text-4xl text-slate-900">Meet Our Hospitality Leaders</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2">
              Passionate professionals dedicated to making every moment of your getaway effortless and remarkable.
            </p>
          </div>
          
          <div className="abt-team-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="abt-team-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="abt-team-img-box h-72 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="abt-team-img w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="abt-team-info p-5 bg-white text-center">
                  <h3 className="abt-member-name font-serif font-bold text-lg text-slate-900">{member.name}</h3>
                  <p className="abt-member-role text-xs uppercase font-bold tracking-wider text-amber-600 mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AboutPage;