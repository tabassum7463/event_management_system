package com.example.eventmanagement.controller;

import com.example.eventmanagement.dto.EventResponse;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.service.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventService eventService;

    
    //1
    @GetMapping()
    public List<EventResponse> getEvents() {
        return eventService.getAllEvents();
    }


    //2
    @GetMapping("/{id}")
    public   ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return  ResponseEntity.ok(eventService.getEventResponseById(id));
    }


    //3
    @GetMapping("/search")
    public List<EventResponse> searchEvents(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category
    ) {
        return eventService.searchEvents(city, category);
    }


    
    //4
    @GetMapping("/upcoming")
    public List<EventResponse> getUpcomingEvents() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysLater = today.plusDays(3);

        return eventService.getAllEvents().stream()
                .filter(event -> !event.getEventDate().isBefore(today)) // today or later
                .filter(event -> !event.getEventDate().isAfter(threeDaysLater)) // within 3 days
                .sorted((e1, e2) -> e1.getEventDate().compareTo(e2.getEventDate()))
                .collect(Collectors.toList());
    }
    
    

    
    @GetMapping("/organizer/{organizerId}")
    public List<EventResponse> getOrganizerEvents(@PathVariable Long organizerId) {
        return eventService.getEventsByOrganizer(organizerId);
    }
    
    
    
    @PostMapping("/organizer/{organizerId}")
    public EventResponse createEvent(@PathVariable Long organizerId,
                                     @RequestBody Event event) {

        Event saved = eventService.createEvent(event, organizerId);
        return eventService.mapToResponse(saved);
    }
    
    
    
    @PutMapping("/organizer/update/{id}")
    public EventResponse updateEvent(@PathVariable Long id,
                                     @RequestBody Event event) {
        return eventService.updateEvent(id, event);
        
    }
    

    @DeleteMapping("/organizer/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted successfully";
    }
    
}