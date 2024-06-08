const express = require('express');
const router = express.Router();
const automationsController = require('../controllers/automationsController');

router.get('/all', automationsController.getAllAutomations);

router.get('/:id', automationsController.getAutomation);

router.get('/', automationsController.getAutomations);

router.delete('/:id', automationsController.deleteAutomation);

router.patch('/launch/:id', automationsController.updateLaunchAutomation);

router.patch('/:id', automationsController.updateAutomation);

router.post('/backtest', automationsController.doBacktest);

router.post('/launch', automationsController.insertLaunchAutomation);

router.post('/:id/start', automationsController.startAutomation);

router.post('/:id/stop', automationsController.stopAutomation);

router.post('/', automationsController.insertAutomation);

module.exports = router;