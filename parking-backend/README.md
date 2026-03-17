# 🚗 Vehicle Parking Slot Management System — Backend API

A REST API built with **Node.js**, **Express**, and **MySQL2** for managing users, vehicles, parking slots, and parking records.

---

## 📁 Project Structure

```
parking-backend/
├── db/
│   └── connection.js          # MySQL connection pool
├── controllers/
│   ├── userController.js
│   ├── vehicleController.js
│   ├── parkingSlotController.js
│   └── parkingRecordController.js
├── routes/
│   ├── userRoutes.js
│   ├── vehicleRoutes.js
│   ├── parkingSlotRoutes.js
│   └── parkingRecordRoutes.js
├── .env                       # Environment variables (not committed to git)
├── .env.example               # Environment variable template
├── server.js                  # Express entry point
└── package.json
```

---

## ⚙️ Setup

### 1. Import the database

```bash
mysql -u root -p < C:\Users\pravi\parkingdb.sql
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=parkingdb
```

### 3. Install dependencies & run

```bash
cd parking-backend
npm install
npm run dev     # development (nodemon)
npm start       # production
```

Server starts at: **http://localhost:3000**

---

## 📌 API Endpoints

### 👤 Users — `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create a new user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

**POST /api/users** — Request body:
```json
{
  "user_id": 6,
  "name": "Ravi Kumar",
  "contact_no": "9876543211",
  "user_type": "Student"
}
```

---

### 🚘 Vehicles — `/api/vehicles`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vehicles` | Register a new vehicle |
| GET | `/api/vehicles` | Get all vehicles (with owner info) |
| GET | `/api/vehicles/:id` | Get vehicle by ID |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |

**POST /api/vehicles** — Request body:
```json
{
  "vehicle_id": 106,
  "vehicle_no": "MH04KL4444",
  "vehicle_type": "Car",
  "frequent_visitor": "N",
  "user_id": 6
}
```

---

### 🅿️ Parking Slots — `/api/slots`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots` | Get all parking slots |
| GET | `/api/slots/available` | Get only available slots |
| GET | `/api/slots/:id` | Get slot by ID |
| POST | `/api/slots` | Create a new slot |
| PUT | `/api/slots/:id` | Update slot |
| DELETE | `/api/slots/:id` | Delete slot |

**POST /api/slots** — Request body:
```json
{
  "slot_id": 6,
  "slot_type": "Car",
  "slot_level": 1,
  "slot_priority": "High",
  "slot_status": "Available"
}
```

---

### 📋 Parking Records — `/api/records`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/records/park` | Park a vehicle (marks slot Occupied) |
| PUT | `/api/records/exit/:record_id` | Process vehicle exit (calculates charges, frees slot) |
| GET | `/api/records` | Get all parking records |
| GET | `/api/records/active` | Get currently active (parked) records |
| GET | `/api/records/:id` | Get record by ID |
| DELETE | `/api/records/:id` | Delete a record |

**POST /api/records/park** — Request body:
```json
{
  "record_id": 1006,
  "vehicle_id": 101,
  "slot_id": 2
}
```

**PUT /api/records/exit/1006** — No body required. 
Response:
```json
{
  "message": "Vehicle exited successfully",
  "record_id": 1006,
  "slot_id": 2,
  "duration_minutes": 90,
  "charges_inr": 50
}
```

> **Charge Rate**: ₹25/hour (rounded up to the nearest hour)

---

## 🔒 Error Handling

All endpoints return consistent JSON error responses:

| Status | Meaning |
|--------|---------|
| 400 | Missing/invalid input |
| 404 | Resource not found |
| 409 | Conflict (duplicate ID, slot not available, already exited) |
| 500 | Internal server error |
