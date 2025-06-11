package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.CalendarEventDto;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarEventService {

    CalendarEventDto createEvent(CalendarEventDto eventDto);

    CalendarEventDto updateEvent(Long eventId, CalendarEventDto eventDto);

    List<CalendarEventDto> getUserEvents(Long userId);

    List<CalendarEventDto> getUserEventsInDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    CalendarEventDto getEventById(Long eventId);

    void deleteEvent(Long eventId);

    List<CalendarEventDto> getEventsByDifficulty(Long userId, String difficultyLevel);

    List<CalendarEventDto> getEventsByMealType(Long userId, String mealType);

    Long countEventsInMonth(Long userId, int year, int month);
}