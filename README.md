# RoyalPark - Luxury Hotel Management System

A full-stack **MERN (MongoDB, Express, React, Node.js)** hotel management and reservation web application built for boutique luxury resorts. The system features a responsive guest booking experience, live suite stock calculation, a 24-hour cancellation window, staff housekeeping operations, and an administrative control panel with cloud image storage.

---

## 🌟 Key Features

### 1. Guest & Customer Portal
- **Luxury Showcase & Catalog**: Explore premium suites with dynamic pricing, amenity tags, room capacities, and high-resolution imagery.
- **Real-Time Room Stock Calculation**: Available suite counts decrement immediately upon booking across all sessions. Badges alert guests when availability is limited (*"Only 1 Left"*, *"Sold Out"*).
- **Direct Reservation Flow**: Multi-step booking modal capturing check-in/out dates, guest details, and automated price calculation.
- **24-Hour Free Cancellation Policy**: Customers can cancel reservations up to 24 hours prior to scheduled check-in. Cancellations automatically restore suite stock. Within 24 hours of check-in, bookings become locked and non-cancellable.
- **Guest Bookings Dashboard (`/mybookings`)**: View all active, upcoming, and past stays, complete with booking reference codes and live cancellation countdown timers.
- **Contact & Inquiries (`/contact`)**: Submit inquiries and special requests directly into the database.

### 2. Role-Based Access & Policy Enforcement
- **Multi-Role Authentication**: Secure registration and login for **Customers**, **Hotel Staff**, and **Administrators** powered by JSON Web Tokens (JWT) and bcrypt password hashing.
- **Operational Policy Guard**: Prevents Administrators and Staff from booking rooms like regular customers, routing them directly to their operational panels.

### 3. Administrator Management Dashboard (`/admin`)
- **Executive Analytics**: Real-time KPI metrics displaying total gross revenue, confirmed bookings, room inventory, and registered users.
- **Suite Catalog Management**: Add, update, and remove suites from the live catalog.
- **Cloud Image Upload (Cloudinary)**: Direct image file upload from device memory to Cloudinary CDN with automatic compression and secure URL storage.
- **Reservation Oversight**: View all guest bookings and update reservation progress (*Confirmed*, *Checked-In*, *Completed*, *Cancelled*).
- **User Account Management**: View registered guest profiles, toggle active/blocked account status, and assign administrative privileges.
- **Inquiry Management**: Review customer messages and contact submissions.

### 4. Staff Operations Console (`/staff`)
- **Housekeeping Board**: Update and monitor room cleanliness status (*Cleaned*, *In Progress*, *Needs Attention*).
- **Task Dispatch Queue**: Create, assign, and resolve prioritized operational tasks (*Urgent*, *Medium*, *Normal*).
- **VIP Guest Arrivals**: Track daily check-in lists and special guest requests.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Component-based user interface
- **React Router DOM (v7)** - Client-side routing and navigation
- **Tailwind CSS** - Modern utility-first styling and glassmorphism design
- **Lucide React & React Icons** - Iconography
- **HTML5 & Vanilla CSS** - Semantic layouts and custom animations

### Backend & Database
- **Node.js** - Server-side runtime environment
- **Express.js** - RESTful API routing and middleware
- **MongoDB & Mongoose** - Document database (MongoDB Atlas cloud connection)
- **JSON Web Tokens (JWT)** - Stateless authentication
- **bcryptjs** - Secure password hashing
- **Multer** - Memory-buffered file upload handling
- **Cloudinary SDK** - Cloud image storage and CDN delivery
- **Cors & Dotenv** - Cross-origin resource sharing and environment management

---

## 📁 Folder Structure

```text
hotel-management/
├── backend/
│   ├── models/            # Mongoose schemas (User, RoomListing)
│   ├── routes/            # REST API endpoints (admin, auth, bookings, staff, upload)
│   ├── .env.example       # Backend environment template
│   ├── package.json       # Backend dependencies and scripts
│   └── server.js          # Express app entry point & MongoDB connection
├── public/                # Public assets and HTML index template
├── screenshots/           # Application preview screenshots
│   └── .gitkeep
├── src/
│   ├── comp/              # React components and page views
│   │   ├── AdminPanel.js  # Admin management console
│   │   ├── StaffPanel.js  # Staff operations console
│   │   ├── Bookingcus.js  # Reservation modal & stock guard
│   │   ├── Mybookingpage.js # Guest booking history & cancellation
│   │   ├── staticroom.js  # Featured suites listing
│   │   └── ...
│   ├── Componentcss/      # Component-level styles
│   ├── images/            # Static local media assets
│   ├── App.js             # Route definitions
│   ├── index.css          # Global CSS tokens & Tailwind imports
│   └── index.js           # React root render
├── .env.example           # Frontend environment template
├── .gitignore             # Git ignore configuration
├── package.json           # Frontend dependencies and scripts
├── tailwind.config.js     # Tailwind design system configuration
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (installed with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- Optional: A free [Cloudinary](https://cloudinary.com/) account for cloud image uploads

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/YugMoradiya22/hotel-management.git
cd hotel-management
```

---

### Step 2: Configure Environment Variables

#### 1. Backend Configuration
Navigate to the `backend` folder and create a `.env` file based on `.env.example`:
```bash
cd backend
cp .env.example .env
```
Open `backend/.env` and provide your real values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hotelDB?retryWrites=true&w=majority
JWT_SECRET=your_secret_jwt_key

# Cloudinary (Optional, for Cloud Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2. Frontend Configuration
In the root directory, create a `.env` file based on `.env.example`:
```bash
cd ..
cp .env.example .env
```
Inside `.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

---

### Step 3: Install Dependencies

#### Install Frontend Dependencies (Root Folder):
```bash
npm install
```

#### Install Backend Dependencies:
```bash
cd backend
npm install
cd ..
```

---

### Step 4: Run the Application

#### 1. Start the Backend API Server:
```bash
cd backend
npm start
```
*The backend server runs on `http://localhost:5000`.*

#### 2. Start the Frontend React App:
Open a second terminal in the project root:
```bash
npm start
```
*The frontend will open in your browser at `http://localhost:3000`.*

---

## 📸 Screenshots

*(Add your application screenshots to the `screenshots/` directory)*

| Home Page | Suite Catalog |
| :---: | :---: |
| ![Home Page](screenshots/home.png) | ![Suite Catalog](screenshots/rooms.png) |

| Booking & Cancellation | My Bookings Dashboard |
| :---: | :---: |
| ![Booking Flow](screenshots/booking.png) | ![My Bookings](screenshots/mybookings.png) |

| Admin Management Panel | Staff Operations Portal |
| :---: | :---: |
| ![Admin Dashboard](screenshots/admin-dashboard.png) | ![Staff Operations](screenshots/staff-portal.png) |

---

## 👨‍💻 Author

**Yug Moradiya**
- GitHub: [@YugMoradiya22](https://github.com/YugMoradiya22)
- Project Repository: [Hotel Management System](https://github.com/YugMoradiya22)
