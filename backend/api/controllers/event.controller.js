const eventRepo = require('../../repositories/scheduler.event.repository');
const AppError = require('../../utils/AppError');
const asyncHandler = require('../../utils/asyncHandler');

class EventController {
    create = asyncHandler(async (req, res, next) => {
        const userId = req.user.id;
        const event = req.body;

        console.log('EventController.create: userId =', userId);
        console.log('EventController.create: request body =', JSON.stringify(event, null, 2));

        const eventData = {
            ...event,
            userId,
            duration: this.calculateDuration(event.startTime, event.endTime)
        };

        console.log('EventController.create: eventData to insert =', JSON.stringify(eventData, null, 2));

        const id = await eventRepo.create(eventData);
        console.log('EventController.create: DB insert returned id =', id);

        const savedEvent = await eventRepo.getById(id);
        console.log('EventController.create: Saved event from DB =', JSON.stringify(savedEvent, null, 2));

        res.json({
            success: true,
            id,
            event: savedEvent
        });
    });

    getById = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const event = await eventRepo.getById(id);

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        res.json({
            success: true,
            event
        });
    });

    getByUserId = asyncHandler(async (req, res, next) => {
        const userId = req.user.id;
        console.log('EventController.getByUserId: userId =', userId);
        
        const events = await eventRepo.getByUserId(userId);
        console.log(`EventController.getByUserId: Found ${events?.length || 0} events for user:`, events);

        res.json({
            success: true,
            events
        });
    });

    update = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const userId = req.user.id;
        const eventData = req.body;

        const existing = await eventRepo.getById(id);

        if (!existing || existing.userId !== userId) {
            throw new AppError('Event not found', 404);
        }

        const updatedData = {
            ...eventData,
            duration: this.calculateDuration(eventData.startTime, eventData.endTime)
        };

        const updated = await eventRepo.update(id, updatedData);

        res.json({
            success: true,
            event: updated
        });
    });

    delete = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const userId = req.user.id;

        const existing = await eventRepo.getById(id);

        if (!existing || existing.userId !== userId) {
            throw new AppError('Event not found', 404);
        }

        await eventRepo.delete(id);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    });

    copy = asyncHandler(async (req, res, next) => {
        const userId = req.user.id;
        const { eventId, targetDays } = req.body;

        const sourceEvent = await eventRepo.getById(eventId);

        if (!sourceEvent || sourceEvent.userId !== userId) {
            throw new AppError('Event not found', 404);
        }

        const createdEvents = [];

        for (const day of targetDays) {
            const newEvent = {
                ...sourceEvent,
                id: undefined,
                daysOfWeek: [day]
            };
            const id = await eventRepo.create(newEvent);
            createdEvents.push(await eventRepo.getById(id));
        }

        res.json({
            success: true,
            events: createdEvents
        });
    });

    bulkCreate = asyncHandler(async (req, res, next) => {
        const userId = req.user.id;
        const { events } = req.body;

        const createdEvents = [];

        for (const event of events) {
            const eventData = {
                ...event,
                userId,
                duration: this.calculateDuration(event.startTime, event.endTime)
            };
            const id = await eventRepo.create(eventData);
            createdEvents.push(await eventRepo.getById(id));
        }

        res.json({
            success: true,
            events: createdEvents
        });
    });

    calculateDuration(startTime, endTime) {
        const start = this.timeToMinutes(startTime);
        const end = this.timeToMinutes(endTime);
        return end - start;
    }

    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }
}

module.exports = new EventController();
