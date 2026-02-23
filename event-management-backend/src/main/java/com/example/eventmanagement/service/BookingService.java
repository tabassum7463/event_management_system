package com.example.eventmanagement.service;

import com.example.eventmanagement.dto.AttendeeDTO;
import com.example.eventmanagement.dto.BookingResponse;
import com.example.eventmanagement.dto.EventResponse;
import com.example.eventmanagement.entity.Booking;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.entity.enums.BookingStatus;
import com.example.eventmanagement.repository.BookingRepository;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class BookingService{

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          EventRepository eventRepository,
                          NotificationService notificationService,UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
        this.userRepository=userRepository;
    }

   
    
    
    @Transactional
    public Booking createBooking(Long eventId, Long userId, int quantity) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        
        Integer sold = bookingRepository.getTotalConfirmedSeats(eventId);
        int bookedSeats = (sold != null) ? sold : 0;

        int availableSeats = event.getTotalSeats() - bookedSeats;


        if (availableSeats <= 0) {
            throw new RuntimeException("No seats available for this event.");
        }

   
        if (quantity > availableSeats) {
            throw new RuntimeException(
                    "Only " + availableSeats + " seat(s) available."
            );
        }

        double totalPrice = event.getPrice() * quantity;

        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUserId(userId);
        booking.setQuantity(quantity);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setBookedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

       
        notificationService.createNotification(
                userId,
                "Your booking for " + event.getTitle() + " is confirmed."
        );

        
        notificationService.createNotification(
                event.getOrganizer().getId(),
                "New booking: " + quantity + " ticket(s) booked for " + event.getTitle()
        );

        return savedBooking;
    }
   
    
    
    public List<BookingResponse> getBookingResponsesByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    @Transactional
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        
        notificationService.createNotification(
                booking.getUserId(),
                "Your booking for " + booking.getEvent().getTitle() + " has been cancelled."
        );

        notificationService.createNotification(
                booking.getEvent().getOrganizer().getId(),
                "A booking was cancelled for event " + booking.getEvent().getTitle()
        );
    }
    
    
 
    
  
    
    private BookingResponse mapToResponse(Booking booking) {
    	BookingResponse response = new BookingResponse();
    	response.setId(booking.getId());
    	response.setQuantity(booking.getQuantity());
    	response.setTotalPrice(booking.getTotalPrice()); 
    	response.setStatus(booking.getStatus().name());
    	response.setBookedAt(booking.getBookedAt()); 
    	EventResponse eventResponse = new EventResponse(); 
    	eventResponse.setId(booking.getEvent().getId()); 
    	eventResponse.setTitle(booking.getEvent().getTitle()); 
    	eventResponse.setCity(booking.getEvent().getCity()); 
    	eventResponse.setEventDate(booking.getEvent().getEventDate()); 
    	eventResponse.setStartTime(booking.getEvent().getStartTime()); 
    	eventResponse.setEndTime(booking.getEvent().getEndTime()); 
    	response.setEvent(eventResponse); 
    	return response; 
    	}
    

    
    
    
    public List<AttendeeDTO> getAttendeesByEvent(Long eventId) {

        List<Booking> bookings = bookingRepository.findByEventId(eventId);

        List<AttendeeDTO> attendees = new ArrayList<>();

        for (Booking booking : bookings) {

            User user = userRepository.findById(booking.getUserId())
                    .orElse(null);

            if (user != null) {
                attendees.add(new AttendeeDTO(
                        booking.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        booking.getQuantity()
                ));
            }
        }

        return attendees;
    }
    
}