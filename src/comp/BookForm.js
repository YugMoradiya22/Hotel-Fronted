import React from "react";
import BookingSteps from "./Bookingstep";
import BookingForm from "./Bookingcus";
import Header2 from "./Header2";
import Footer from "./footer";

function Bookformpage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header2 />
      <BookingSteps activeStep={2} />
      <div className="flex-grow">
        <BookingForm />
      </div>
      <Footer />
    </div>
  );
}

export default Bookformpage;