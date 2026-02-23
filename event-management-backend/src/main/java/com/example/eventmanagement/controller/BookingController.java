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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
	
	
    @Autowired
	private EventService eventService;
	
    @Autowired
    private  BookingService bookingService;

   
    //1
    @PostMapping("/create")
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(
                request.getEventId(),
                request.getUserId(),
                request.getQuantity()
        );
    }

    
    
    //2
    @GetMapping("/user/{userId}")
    public List<BookingResponse> getUserBookings(@PathVariable Long userId) {
        return bookingService.getBookingResponsesByUser(userId);
    }

    
    
    //3
    @PostMapping("/cancel/{id}")
    public void cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
    }
    
    
    
    //4
    @GetMapping("/event/{eventId}/attendees")
    public ResponseEntity<List<AttendeeDTO>> getAttendees(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                bookingService.getAttendeesByEvent(eventId)
        );
    }
}