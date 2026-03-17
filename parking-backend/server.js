require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const parkingSlotRoutes = require('./routes/parkingSlotRoutes');
const parkingRecordRoutes = require('./routes/parkingRecordRoutes');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── API Routes ────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/slots', parkingSlotRoutes);
app.use('/api/records', parkingRecordRoutes);

// ── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: '🚗 Parking Management API is running!' });
});

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
