import { Routes, Route, Navigate } from "react-router-dom";

import Bookingpage from "./comp/Bookingpage";
import Bookformpage from "./comp/BookForm";
import Mybooking from "./comp/Mybookingpage";
import OfferPage from "./comp/Offerpage";

// Auth, Admin & Staff pages
import Register from "./comp/Registration";
import Login from "./comp/Login";
import AdminPanel from "./comp/AdminPanel";
import StaffPanel from "./comp/StaffPanel";

// Landing page components
import Herosection from "./comp/index";
import AboutUs from "./comp/About";
import Middle from "./comp/Middle";
import Footer from "./comp/footer";
import Rooms from "./comp/staticroom";
import Small from "./comp/small";
import OffersHero from "./comp/Offer";
import Events from "./comp/Event";
import GuestReviews from "./comp/GuestReviews";
import AboutPage from "./comp/Aboutpage";
import Contact from "./comp/Contact";
import EXPO from "./comp/expo";
import Services from "./comp/services";

function App() {
  return (
    <Routes>
      {/* ===== Landing Page ===== */}
      <Route
        path="/"
        element={
          <>
            <Herosection />
            <AboutUs />
            <Rooms />
            <Middle />
            <Small />
            <Events />
            <GuestReviews />
            <OffersHero />
            <Footer />
          </>
        }
      />

      {/* Navigation routes */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/aboutpage" element={<AboutPage />} />
      <Route path="/explore" element={<EXPO />} />
      <Route path="/services" element={<Services />} />
      <Route path="/offers" element={<OfferPage />} />

      {/* Booking flow */}
      <Route path="/rooms" element={<Bookingpage />} />
      <Route path="/bookingpage" element={<Bookingpage />} />
      <Route path="/BookingFrompage" element={<Bookformpage />} />
      <Route path="/mybookings" element={<Mybooking />} />

      {/* Auth, Admin & Staff Pages */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/staff" element={<StaffPanel />} />

      {/* Safety Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
