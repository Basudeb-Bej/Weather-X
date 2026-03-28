# 🌦️ Weather-X – Full Stack MERN Weather Application

A modern, production-ready weather application built using the MERN stack.  
It provides real-time weather data, location-based forecasts, and a clean, responsive UI inspired by real-world applications.

🔗 **Live Demo:** https://weather-x-flame.vercel.app

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
├── front-end/                # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│
├── back-end/                # Backend (Node.js)
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
cd back-end
npm install
```

Create a `.env` file inside `back-end/` (copy from `.env.example`):

```
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
OPENWEATHER_API_KEY=your_openweather_api_key
```

> **Note:** Never commit your `.env` file. It is listed in `.gitignore`.

Run backend server:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd front-end
npm install
npm run dev
```

---

## 🚀 Production Deployment (Render + Vercel + MongoDB Atlas)

### MongoDB Atlas – Network Access

Before deploying, make sure your MongoDB Atlas cluster allows connections from your hosting provider:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to **Network Access** → **Add IP Address**
3. For Render (or any cloud host with dynamic IPs), add `0.0.0.0/0` to allow all IPs
4. Click **Confirm**

> Without this step, the backend will log `MongoDB connection failed` and search history will not work.

---

### Render (Backend)

Set the following **Environment Variables** in your Render service:

| Variable | Value |
|---|---|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority` |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |
| `PORT` | `8000` |

- **Root Directory:** `back-end`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

After setting variables, redeploy the service. You should see `MongoDB Connected: ...` in the logs.

---

### Vercel (Frontend)

Set the following **Environment Variable** in your Vercel project:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://your-render-backend-url.onrender.com` |

- **Root Directory:** `front-end`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Redeploy after setting the environment variable.

---

### Diagnosing Connection Issues

Visit `https://your-render-backend-url.onrender.com/api/health` to check the live DB status:

```json
{ "success": true, "status": "ok", "database": "connected" }
```

If `"database": "disconnected"`, check:
1. `MONGODB_URI` is set correctly in Render
2. MongoDB Atlas Network Access allows `0.0.0.0/0`
3. The username and password in the URI are correct (URL-encode special characters)

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
