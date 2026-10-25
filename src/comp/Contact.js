import React, { useState } from 'react';
import Header2 from './Header2';
import Footer from './footer';
import '../Componentcss/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page-wrapper min-h-screen flex flex-col bg-slate-50">
      <Header2 />

      {/* --- HEADER BANNER --- */}
      <div className="contact-hero relative py-20 bg-slate-900 text-white text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c59b27_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <p className="contact-tag text-xs uppercase tracking-[0.3em] text-amber-400 font-bold mb-2">
            Get In Touch
          </p>
          <h1 className="contact-title font-serif text-4xl md:text-5xl font-bold">
            Concierge & Contact
          </h1>
          <p className="text-slate-300 max-w-md mx-auto text-sm mt-3">
            Our guest relations team is available 24/7 to assist with room inquiries, private events, or bespoke requests.
          </p>
        </div>
      </div>

      <div className="contact-container max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        <div className="contact-grid grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: CONTACT FORM --- */}
          <div className="contact-form-section lg:col-span-7 bg-white p-8 rounded-2xl shadow-lg border-t-4 border-amber-600">
            <h2 className="contact-heading font-serif text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
            <p className="text-slate-500 text-xs mb-6">Fill in the form below and our team will respond within 2 business hours.</p>

            {submitted && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm flex items-center gap-2">
                <span>✓</span>
                <span>Thank you! Your message has been received. Our concierge will be in touch shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="contact-input-group">
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-sm p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="E.g. Lord Alexander"
                    required
                  />
                </div>
                <div className="contact-input-group">
                  <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-sm p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="alexander@example.com"
                    required
                  />
                </div>
              </div>

              <div className="contact-input-group">
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full text-sm p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  placeholder="Booking Inquiry / Special Request"
                />
              </div>

              <div className="contact-input-group">
                <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Message *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full text-sm p-3 border border-slate-300 rounded-lg outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 resize-none"
                  placeholder="Please describe how our team can assist you..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* --- RIGHT: INFO & MAP --- */}
          <div className="contact-info-section lg:col-span-5 space-y-6">
            
            {/* Contact Details */}
            <div className="contact-details-box bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <h2 className="contact-heading font-serif text-2xl font-bold text-slate-900 mb-6">Concierge Details</h2>
              
              <div className="contact-list space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-lg">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Address</h3>
                    <p className="text-slate-500 mt-1 leading-relaxed">100 Royal Avenue, Marine Bay District, Mumbai, 400001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-lg">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Direct Phone</h3>
                    <p className="text-slate-500 mt-1">+91 (022) 555-ROYAL</p>
                    <p className="text-slate-500">+91 987 654 3210 (VIP Concierge)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-lg">
                    ✉️
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Email</h3>
                    <p className="text-slate-500 mt-1">reservations@royalpark.com</p>
                    <p className="text-slate-500">concierge@royalpark.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-map-wrapper h-64 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <iframe 
                title="Hotel Location Map"
                src="https://maps.google.com/maps?q=Marine%20Drive%20Mumbai&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy">
              </iframe>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Contact;