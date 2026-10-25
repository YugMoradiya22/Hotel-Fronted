import React from "react";
import hotelVideo from "../images/Luxury_hotel.mp4";
import Header2 from "./Header2";
import Footer from "./footer";
import { Link } from "react-router-dom";

export default function EXPO() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col text-slate-800">
      <Header2 />

      {/* Hero Section */}
      <div className="relative py-20 bg-slate-900 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c59b27_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-bold font-sans">
            Our Architectural Vision
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 tracking-tight">
            The Story Behind <span className="text-amber-400 italic font-serif">RoyalPark</span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base">
            Discover the passion, craftsmanship, and dedication that transformed a visionary concept into a sanctuary of refined elegance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-grow">

        {/* Introduction */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-600 block mb-1">Heritage & Heart</span>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
            A Legacy of Modern Grandeur
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            From the initial blueprint to the grand opening, RoyalPark was conceptualized not simply as a hotel, but as an experience in elevated living. Situated along prime waterfront grounds, we merge timeless hospitality with contemporary comfort.
          </p>
        </div>

        {/* Video Feature */}
        <div className="w-full bg-slate-900 rounded-3xl overflow-hidden mb-16 shadow-2xl border border-amber-900/20">
          <video
            className="w-full h-80 md:h-[450px] object-cover"
            src={hotelVideo}
            controls
            autoPlay
            muted
            loop
            playsInline
          >
            Your browser does not support the video tag.
          </video>
          <div className="p-4 bg-slate-900/90 text-center text-xs text-amber-400/80 font-mono tracking-wider">
            FILMED ON-LOCATION AT ROYALPARK PALACE GROUNDS
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-amber-500">
            <h3 className="text-xl font-serif font-bold mb-3 text-slate-900">
              Our Mission
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To deliver an exceptional hospitality experience that seamlessly blends comfort, elegance, and personalized attention. We aim to create a welcoming environment where every guest feels valued, relaxed, and truly at home.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-slate-900">
            <h3 className="text-xl font-serif font-bold mb-3 text-slate-900">
              Our Vision
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To stand as an international benchmark of luxury hospitality, celebrated for authentic warmth, culinary brilliance, and creating cherished memories across every guest stay.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-10 shadow-xl">
          <h3 className="text-2xl font-serif font-bold mb-2">Ready to Experience It Yourself?</h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
            Reserve your suite today and let our dedicated concierge prepare your stay.
          </p>
          <Link
            to="/rooms"
            className="inline-block px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Explore Accommodations
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
