const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const eventController = require('../controllers/event.controller');
const auth = require('../middleware/authMiddleware');

// Schedule routes
router.post('/schedule/generate', auth, scheduleController.generateWeeklySchedule.bind(scheduleController));
router.get('/schedule/:weekId', auth, scheduleController.getSchedule.bind(scheduleController));
router.get('/schedule/current', auth, scheduleController.getCurrentSchedule.bind(scheduleController));
router.put('/schedule/:weekId', auth, scheduleController.adjustSchedule.bind(scheduleController));
router.post('/schedule/validate', auth, scheduleController.validateSchedule.bind(scheduleController));

// Revision units routes
router.get('/revision-units', auth, scheduleController.getRevisionUnits.bind(scheduleController));
router.post('/revision-units/generate', auth, scheduleController.generateRevisionUnits.bind(scheduleController));

// Event routes
router.post('/events', auth, eventController.create.bind(eventController));
router.get('/events', auth, eventController.getByUserId.bind(eventController));
router.get('/events/:id', auth, eventController.getById.bind(eventController));
router.put('/events/:id', auth, eventController.update.bind(eventController));
router.delete('/events/:id', auth, eventController.delete.bind(eventController));
router.post('/events/copy', auth, eventController.copy.bind(eventController));
router.post('/events/bulk', auth, eventController.bulkCreate.bind(eventController));

module.exports = router;
