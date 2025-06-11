package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.CalendarEventDto;
import com.blog.BlogBackend.entity.CalendarEvent;
import com.blog.BlogBackend.entity.Post;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.repository.CalendarEventRepo;
import com.blog.BlogBackend.repository.PostRepo;
import com.blog.BlogBackend.repository.UserRepo;
import com.blog.BlogBackend.service.CalendarEventService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CalendarEventServiceImpl implements CalendarEventService {

    @Autowired
    private CalendarEventRepo calendarEventRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PostRepo postRepo;

    @Override
    @Transactional
    public CalendarEventDto createEvent(CalendarEventDto eventDto) {
        User user = userRepo.findById(eventDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CalendarEvent event = CalendarEvent.builder()
                .title(eventDto.getTitle())
                .startDateTime(eventDto.getStartDateTime())
                .endDateTime(eventDto.getEndDateTime())
                .allDay(eventDto.getAllDay() != null ? eventDto.getAllDay() : false)
                .backgroundColor(eventDto.getBackgroundColor())
                .borderColor(eventDto.getBorderColor())
                .textColor(eventDto.getTextColor())
                .difficultyLevel(eventDto.getDifficultyLevel())
                .mealType(eventDto.getMealType())
                .notes(eventDto.getNotes())
                .user(user)
                .build();

        // Nếu có postId, liên kết với Post
        if (eventDto.getPostId() != null) {
            Post post = postRepo.findById(eventDto.getPostId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            event.setPost(post);
        }

        CalendarEvent savedEvent = calendarEventRepo.save(event);
        return convertToDto(savedEvent);
    }

    @Override
    @Transactional
    public CalendarEventDto updateEvent(Long eventId, CalendarEventDto eventDto) {
        CalendarEvent event = calendarEventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Calendar event not found"));

        // Cập nhật thông tin
        event.setTitle(eventDto.getTitle());
        event.setStartDateTime(eventDto.getStartDateTime());
        event.setEndDateTime(eventDto.getEndDateTime());
        event.setAllDay(eventDto.getAllDay() != null ? eventDto.getAllDay() : false);
        event.setBackgroundColor(eventDto.getBackgroundColor());
        event.setBorderColor(eventDto.getBorderColor());
        event.setTextColor(eventDto.getTextColor());
        event.setDifficultyLevel(eventDto.getDifficultyLevel());
        event.setMealType(eventDto.getMealType());
        event.setNotes(eventDto.getNotes());

        // Cập nhật Post nếu có
        if (eventDto.getPostId() != null) {
            Post post = postRepo.findById(eventDto.getPostId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            event.setPost(post);
        }

        CalendarEvent updatedEvent = calendarEventRepo.save(event);
        return convertToDto(updatedEvent);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDto> getUserEvents(Long userId) {
        List<CalendarEvent> events = calendarEventRepo.findByUserId(userId);
        return events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDto> getUserEventsInDateRange(Long userId,
                                                           LocalDateTime startDate,
                                                           LocalDateTime endDate) {
        List<CalendarEvent> events = calendarEventRepo.findByUserAndDateRange(userId, startDate, endDate);
        return events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CalendarEventDto getEventById(Long eventId) {
        CalendarEvent event = calendarEventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Calendar event not found"));
        return convertToDto(event);
    }

    @Override
    @Transactional
    public void deleteEvent(Long eventId) {
        CalendarEvent event = calendarEventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Calendar event not found"));
        calendarEventRepo.delete(event);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDto> getEventsByDifficulty(Long userId, String difficultyLevel) {
        List<CalendarEvent> events = calendarEventRepo.findByUserIdAndDifficultyLevel(userId, difficultyLevel);
        return events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDto> getEventsByMealType(Long userId, String mealType) {
        List<CalendarEvent> events = calendarEventRepo.findByUserIdAndMealType(userId, mealType);
        return events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long countEventsInMonth(Long userId, int year, int month) {
        return calendarEventRepo.countEventsInMonth(userId, year, month);
    }

    private CalendarEventDto convertToDto(CalendarEvent event) {
        return CalendarEventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .startDateTime(event.getStartDateTime())
                .endDateTime(event.getEndDateTime())
                .allDay(event.getAllDay())
                .backgroundColor(event.getBackgroundColor())
                .borderColor(event.getBorderColor())
                .textColor(event.getTextColor())
                .difficultyLevel(event.getDifficultyLevel())
                .mealType(event.getMealType())
                .notes(event.getNotes())
                .userId(event.getUser().getId())
                .postId(event.getPost() != null ? event.getPost().getPostId() : null)
                .postTitle(event.getPost() != null ? event.getPost().getTitle() : null)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}