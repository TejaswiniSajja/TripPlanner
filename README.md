# 🌍 AI Trip Planner

An AI-powered full-stack Trip Planner web application that helps users create and manage travel plans easily. Users can sign up, log in securely, create trips, and view detailed trip information through a modern and responsive interface.

---

## 🚀 Features

- 🔐 User Authentication (Signup/Login)
- 🛡️ Protected Routes using JWT Authentication
- ✈️ Create and Manage Trips
- 🤖 AI-based Trip Planning Support
- 📋 Dashboard to View Trips
- 📱 Responsive UI
- ⚡ Fast Frontend with React
- 🌐 REST API Integration
- ☁️ MongoDB Database Integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

---

## 📂 Project Structure

```bash
trip-planner/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│
├── server/                 # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── services/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/TejaswiniSajja/TripPlanner.git
cd TripPlanner
```

---

## 🔹 Frontend Setup

```bash
cd client
npm install
npm start
```

Frontend runs on:
```bash
http://localhost:3000
```

---

## 🔹 Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend runs on:
```bash
http://localhost:5000
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_api_key
PORT=5000
```

---

## 📸 Screenshots

### Home Page
(Add screenshot here)

### Dashboard
(Add screenshot here)

### Create Trip Page
(Add screenshot here)

---

## 🌐 Future Improvements

- 🌍 Google Maps Integration
- 🏨 Hotel Recommendations
- 🌦️ Weather Forecast Feature
- 💳 Trip Budget Calculator
- 📍 Live Location Tracking
- 📅 Calendar Integration

---

## 👩‍💻 Author

### Tejaswini Sajja

- GitHub: https://github.com/TejaswiniSajja

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
