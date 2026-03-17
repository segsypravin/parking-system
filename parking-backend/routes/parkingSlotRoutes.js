const express = require('express');
const router = express.Router();
const {
    getAllSlots,
    getAvailableSlots,
    getSlotById,
    createSlot,
    updateSlot,
    deleteSlot,
} = require('../controllers/parkingSlotController');

// IMPORTANT: /available must be declared BEFORE /:id
router.get('/available', getAvailableSlots);
router.get('/', getAllSlots);
router.get('/:id', getSlotById);
router.post('/', createSlot);
router.put('/:id', updateSlot);
router.delete('/:id', deleteSlot);

module.exports = router;
