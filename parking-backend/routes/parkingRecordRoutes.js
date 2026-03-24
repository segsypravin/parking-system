const express = require('express');
const router = express.Router();
const {
    parkVehicle,
    exitVehicle,
    getAllRecords,
    getActiveRecords,
    getRecordById,
    deleteRecord,
} = require('../controllers/parkingRecordController');

// IMPORTANT: specific paths before /:id
router.get('/active', getActiveRecords);
router.post('/park', parkVehicle);
router.put('/exit/:record_id', exitVehicle);

router.get('/', getAllRecords);
router.get('/:id', getRecordById);
router.delete('/:id', deleteRecord);

module.exports = router;
