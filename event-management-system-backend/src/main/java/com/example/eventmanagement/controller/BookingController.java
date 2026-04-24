package com.example.eventmanagement.controller;


import com.example.eventmanagement.dto.AttendeeDTO;
import com.example.eventmanagement.dto.BookingRequest;
import com.example.eventmanagement.dto.BookingResponse;
import com.example.eventmanagement.entity.Booking;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.service.BookingService;
import com.example.eventmanagement.service.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private EventService eventService;

    @Autowired
    private BookingService bookingService;


    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('USER','ORGANIZER')")
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(
                request.getEventId(),
                request.getUserId(),
                request.getQuantity()
        );
    }


    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<BookingResponse> getUserBookings(@PathVariable Long userId) {
        return bookingService.getBookingResponsesByUser(userId);
    }

   
    @PostMapping("/cancel/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public void cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
    }

 
    @GetMapping("/event/{eventId}/attendees")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public ResponseEntity<List<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                bookingService.getAttendeesByEvent(eventId)
        );
    }
}