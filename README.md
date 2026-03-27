# 🌦️ Weather-X – Full Stack MERN Weather Application

A modern, production-ready weather application built using the MERN stack.  
It provides real-time weather data, location-based forecasts, and a clean, responsive UI inspired by real-world applications.

🔗 **Live Demo:** https://weather-x-blue.vercel.app/

---

## 📌 Overview

Weather-X is a full-stack web application that allows users to:

* Search weather by city  
* Detect current location automatically  
* View real-time weather conditions  
* Experience a clean and responsive UI  

This project demonstrates **full-stack development**, **API integration**, and **scalable architecture** using modern technologies.

---

## 🚀 Features

### 🌍 Weather Functionality

* Search weather by city name  
* Get real-time weather data  
* Location-based weather using Geolocation API  
* Display:
  * Temperature  
  * Weather condition  
  * Humidity  
  * Wind speed  

### ⚡ Performance & UX

* Fast loading interface  
* Responsive design (mobile + desktop)  
* Clean and minimal UI  
* Error handling (invalid city, API failure)  

### 🗄️ Backend Features

* RESTful API design  
* MongoDB database integration  
* Search history storage  
* Structured backend (MVC pattern)  

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)  
* Axios  
* Tailwind CSS  

### Backend

* Node.js  
* Express.js  
* MongoDB (Mongoose)  

### External API

* OpenWeatherMap API  

---

## 🏗️ Project Structure

```
Weather-X/
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│
├── server/                # Backend (Node.js)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Basudeb-Bej/Weather-X.git
cd Weather-X
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```
PORT=5000
API_KEY=your_openweather_api_key
MONGO_URI=your_mongodb_connection_string
```

Run backend server:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints

### Weather

* `GET /api/weather/current?city=Kolkata`
* `GET /api/weather/location?lat=XX&lon=YY`

### Search History

* `GET /api/history`
* `POST /api/history`

---

## 🌐 Deployment

### Frontend

* Deployed on Vercel  

### Backend

* Deployed on Render  

---

## 🔐 Environment Variables

### Backend (.env)

```
PORT=5000
API_KEY=your_api_key
MONGO_URI=your_database_url
```

### Frontend (.env)

```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🧪 How It Works

1. User searches for a city or enables location  
2. Frontend sends request to backend API  
3. Backend fetches data from OpenWeather API  
4. Data is processed and returned  
5. Frontend displays weather information  

---

## 🎯 Future Enhancements

* 📊 Weather charts (hourly & weekly forecast)  
* ⭐ Favorite cities feature  
* 🔐 User authentication (JWT)  
* 🌍 Interactive map integration  
* ⚡ API caching for performance  
* 📱 Progressive Web App (PWA)  

---

## 🤝 Contributing

Contributions are welcome!

Steps:
1. Fork the repository  
2. Create a new branch  
3. Make changes  
4. Submit a pull request  

---

## 📸 Screenshots

> Add screenshots here to improve project visibility

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Basudeb Bej**  
BCA Student | MERN Stack Developer  

---

## ⭐ Support

If you like this project:

* ⭐ Star the repository  
* 🍴 Fork it  
* 📢 Share it  

---

## 💡 Notes

* This project follows industry-level architecture  
* Clean separation between frontend and backend  
* Scalable and production-ready structure  

---
