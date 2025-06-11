import api from './api'

// Create a new calendar event
export const createCalendarEvent = (eventData) =>
    api.post('/calendar/events', eventData)

// Update an existing calendar event
export const updateCalendarEvent = (eventId, eventData) =>
    api.put(`/calendar/events/${eventId}`, eventData)

// Get a specific calendar event by ID
export const fetchCalendarEventById = (eventId) =>
    api.get(`/calendar/events/${eventId}`)

// Delete a calendar event
export const deleteCalendarEvent = (eventId) =>
    api.delete(`/calendar/events/${eventId}`)

// Get all events for a user
export const fetchUserCalendarEvents = (userId) =>
    api.get(`/calendar/users/${userId}/events`)

// Get user events in a specific date range
export const fetchUserCalendarEventsInRange = (userId, startDate, endDate) => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);

    return api.get(`/calendar/users/${userId}/events/range?${params.toString()}`);
}

// Get events by difficulty level
export const fetchCalendarEventsByDifficulty = (userId, difficultyLevel) =>
    api.get(`/calendar/users/${userId}/events/difficulty/${difficultyLevel}`)

// Get events by meal type
export const fetchCalendarEventsByMealType = (userId, mealType) =>
    api.get(`/calendar/users/${userId}/events/meal/${mealType}`)

// Get events count in a specific month
export const fetchCalendarEventsCount = (userId, year, month) => {
    const params = new URLSearchParams();
    params.append('year', year);
    params.append('month', month);

    return api.get(`/calendar/users/${userId}/events/count?${params.toString()}`);
}