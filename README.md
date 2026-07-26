#  AI-Powered Healthcare Website

A modern full-stack healthcare web application that enables users to access healthcare services online, including doctor appointments, medicine search, lab test booking, emergency contacts, hospitals, health blogs, and AI-powered chat support.

## Live Demo

**Frontend:** https://syedaalishba12.github.io/ai-healthcare-website/


---

# Features

### Authentication
- User Registration
- User Login
- Forgot Password
- JWT Authentication

### Home Page
- Hero Section
- Featured Doctors
- Healthcare Services
- Testimonials
- Health Statistics

### Doctors
- View Doctors
- Doctor Details
- Book Appointment

### Medicines
- Browse Medicines
- Medicine Details
- Shopping Cart
- Checkout

### Lab Tests
- Browse Available Tests
- Search Lab Tests
- Book Lab Tests

### Hospitals
- Nearby Hospitals
- Interactive Map

### Emergency
- Emergency Contact Information

### Health Blog
- Health Articles
- Blog Details

### AI Chat Support
- AI-powered healthcare assistant

### Contact
- Contact Form

---

#  Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Leaflet
- React Leaflet

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

#  Project Structure

```
AI-Healthcare-Website
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── utils
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend

npm install

npm start
```

Backend runs on:

```
http://localhost:5000
```

---

#  Environment Variables

Create a `.env` file inside the **backend** folder.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
AI_API_KEY=your_api_key
PORT=5000
```

---

#  API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/forgot-password`

### Doctors

- GET `/api/doctors`
- GET `/api/doctors/:id`

### Appointments

- POST `/api/appointments`

### Medicines

- GET `/api/medicines`

### Cart

- GET `/api/cart`
- POST `/api/cart`

### Orders

- POST `/api/orders`

### Blogs

- GET `/api/blogs`

### Lab Tests

- GET `/api/lab-tests`
- POST `/api/lab-tests/book`

### Hospitals

- GET `/api/hospitals`

### Emergency

- GET `/api/emergency`

### Contact

- POST `/api/contact`

---

#  Team

Developed as part of an internship project.

### Team Lead
- **Syeda Alishba**

### Team Members
-Zainab Bibi
-Syed Sayeel Abbas
-Fatima Khalid Siddiqui
-Taha Tanvir

---

#  Future Improvements

- Admin Dashboard
- Online Payments
- User Profiles
- Appointment History
- Medicine Order Tracking
- Lab Report Download
- Notifications
- Video Consultation

---

# 📄 License

This project was developed for educational and internship purposes.