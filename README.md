# ⚡ Smart Grid Optimizer

> **An AI-based platform for optimizing smart grid energy usage with real-time monitoring and intelligent insights.**

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-blue)
![React](https://img.shields.io/badge/Frontend-React-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-informational)

---

## ✨ Features

- 📊 **Real-time energy consumption dashboard**
- ☀️ **Live monitoring of renewable energy generation**
- 🛡️ **Grid stability tracking**
- 📄 **Comprehensive energy audit reports**
- 🤖 **AI-based optimization suggestions**

---

## 📁 Project Structure



```
.
├── backend/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   └── App.tsx
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Create a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Unix/MacOS
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend server:
   ```bash
   cd app
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/current-status` - Get current energy status
- `GET /api/energy-audit` - Get energy audit report
- `WS /ws/live-data` - WebSocket endpoint for real-time updates

## Technologies Used

- Backend:
  - FastAPI
  - Python
  - NumPy
  - WebSockets

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Recharts

## License

MIT 
