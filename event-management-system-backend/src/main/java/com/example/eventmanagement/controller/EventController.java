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


import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

 
    @GetMapping()
    @PreAuthorize("hasAnyRole('USER','ORGANIZER','ADMIN')")
    public List<EventResponse> getEvents() {
        return eventService.getAllEvents();
    }

    
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ORGANIZER','ADMIN')")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventResponseById(id));
    }

    
    
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER','ORGANIZER','ADMIN')")
    public List<EventResponse> searchEvents(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category
    ) {
        return eventService.searchEvents(city, category);
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyRole('USER','ORGANIZER','ADMIN')")
    public List<EventResponse> getUpcomingEvents() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysLater = today.plusDays(3);

        return eventService.getAllEvents().stream()
                .filter(event -> !event.getEventDate().isBefore(today))
                .filter(event -> !event.getEventDate().isAfter(threeDaysLater))
                .sorted((e1, e2) -> e1.getEventDate().compareTo(e2.getEventDate()))
                .collect(Collectors.toList());
    }


    
    @GetMapping("/organizer/{organizerId}")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public List<EventResponse> getOrganizerEvents(@PathVariable Long organizerId) {
        return eventService.getEventsByOrganizer(organizerId);
    }

    
    
    @PostMapping("/organizer/{organizerId}")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public EventResponse createEvent(@PathVariable Long organizerId,
                                     @RequestBody Event event) {
        Event saved = eventService.createEvent(event, organizerId);
        return eventService.mapToResponse(saved);
    }
    
    

    @PutMapping("/organizer/update/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public EventResponse updateEvent(@PathVariable Long id,
                                     @RequestBody Event event) {
    	
        System.out.println("Update API called for event id: " + id);

    	
        return eventService.updateEvent(id, event);
    }
    
    

    @DeleteMapping("/organizer/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted successfully";
    }
}