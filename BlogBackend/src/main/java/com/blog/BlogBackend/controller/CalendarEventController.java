package com.blog.BlogBackend.controller;

import com.blog.BlogBackend.dto.CalendarEventDto;
import com.blog.BlogBackend.service.CalendarEventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/calendar")
public class CalendarEventController {

    @Autowired
    private CalendarEventService calendarEventService;

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@Valid @RequestBody CalendarEventDto eventDto) {
        try {
            CalendarEventDto createdEvent = calendarEventService.createEvent(eventDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to create calendar event: " + e.getMessage());
        }
    }

    @PutMapping("/events/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId,
                                         @RequestBody CalendarEventDto eventDto) {
        try {
            CalendarEventDto updatedEvent = calendarEventService.updateEvent(eventId, eventDto);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Failed to update calendar event: " + e.getMessage());
        }
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getEvent(@PathVariable Long eventId) {
        try {
            CalendarEventDto event = calendarEventService.getEventById(eventId);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Calendar event not found with id " + eventId);
        }
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        try {
            calendarEventService.deleteEvent(eventId);
            return ResponseEntity.ok("Calendar event deleted successfully");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Calendar event not found with id " + eventId);
        }
    }

    @GetMapping("/users/{userId}/events")
    public ResponseEntity<?> getUserEvents(@PathVariable Long userId) {
        try {
            List<CalendarEventDto> events = calendarEventService.getUserEvents(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to get user events: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/events/range")
    public ResponseEntity<?> getUserEventsInRange(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            List<CalendarEventDto> events = calendarEventService.getUserEventsInDateRange(userId, start, end);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to get user events in date range: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/events/difficulty/{difficultyLevel}")
    public ResponseEntity<?> getEventsByDifficulty(@PathVariable Long userId,
                                                   @PathVariable String difficultyLevel) {
        try {
            List<CalendarEventDto> events = calendarEventService.getEventsByDifficulty(userId, difficultyLevel);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to get events by difficulty: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/events/meal/{mealType}")
    public ResponseEntity<?> getEventsByMealType(@PathVariable Long userId,
                                                 @PathVariable String mealType) {
        try {
            List<CalendarEventDto> events = calendarEventService.getEventsByMealType(userId, mealType);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to get events by meal type: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/events/count")
    public ResponseEntity<?> getEventsCountInMonth(@PathVariable Long userId,
                                                   @RequestParam int year,
                                                   @RequestParam int month) {
        try {
            Long count = calendarEventService.countEventsInMonth(userId, year, month);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to count events: " + e.getMessage());
        }
    }
}