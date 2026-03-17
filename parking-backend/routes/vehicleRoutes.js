const express = require('express');
const router = express.Router();
const {
    registerVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
} = require('../controllers/vehicleController');

router.post('/', registerVehicle);
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
