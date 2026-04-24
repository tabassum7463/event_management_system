package com.example.eventmanagement.service;
import org.springframework.transaction.annotation.Transactional;
import com.example.eventmanagement.dto.EventResponse;
import com.example.eventmanagement.entity.Booking;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.User;
import com.example.eventmanagement.entity.enums.BookingStatus;
import com.example.eventmanagement.entity.enums.UserRole;
import com.example.eventmanagement.exception.ResourceNotFoundException;
import com.example.eventmanagement.repository.BookingRepository;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

	
	
	@Autowired
	private BookingRepository bookingRepository;
	
	
	@Autowired
	private NotificationService notificationService;
	
	
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    
    
    
       
    //2
    public EventResponse getEventResponseById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        return mapToResponse(event);
    }
    
    
    
    
    
    
    // 3
    public List<EventResponse> searchEvents(String city, String category) {

        List<Event> events;

        if (city != null && category != null) {
            events = eventRepository.findAll()
                    .stream()
                    .filter(e -> e.getCity().equalsIgnoreCase(city)
                            && e.getCategory().equalsIgnoreCase(category))
                    .collect(Collectors.toList());

        } else if (city != null) {
            events = eventRepository.findByCityIgnoreCase(city);

        } else if (category != null) {
            events = eventRepository.findByCategoryIgnoreCase(category);

        } else {
            events = eventRepository.findAll();
        }

        if (events.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No events present for given search criteria"
            );
        }

        return events.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
  
    
    
    
    
    //4
        @Transactional
        public List<EventResponse> getEventsByOrganizer(Long organizerId) {

        	
        	  User organizer = userRepository.findById(organizerId)
                      .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));
        	
        	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            

            if (!organizer.getEmail().equals(email)) {
                throw new AccessDeniedException(
                        "You cannot view events of another organizer");
            }

            List<Event> events = eventRepository.findByOrganizer_Id(organizerId);

            return events.stream()
                    .map(this::mapToResponse)
                    .toList();
        }
        
        
//5
@Transactional
public Event createEvent(Event event, Long organizerId) {
	
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();

    User currentUser = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    User organizer = userRepository.findById(organizerId)
            .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

  
    if (!organizer.getId().equals(currentUser.getId())) {
        throw new AccessDeniedException("You are not allowed to create event for another organizer");
    }

    event.setOrganizer(organizer);
    event.setAvailableSeats(event.getTotalSeats());

    Event savedEvent = eventRepository.save(event);

    List<User> users = userRepository.findByRole(UserRole.USER);

    for (User user : users) {
        notificationService.createNotification(
                user.getId(),
                "New event \"" + savedEvent.getTitle() + "\" has been created!"
        );
    }

    return savedEvent;
}



@Transactional
public void deleteEvent(Long id) {

    Event event = eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

   
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    User loggedInUser = userRepository.findByEmailIgnoreCase(email).get();

 
    if (!event.getOrganizer().getId().equals(loggedInUser.getId())) {
        throw new AccessDeniedException("You are not allowed to delete this event");
    }

    List<User> users = userRepository.findByRole(UserRole.USER);
    for (User user : users) {
        notificationService.createNotification(
                user.getId(),
                "Event \"" + event.getTitle() + "\" has been cancelled by the organizer. Payment will be refunded within 24 hours."
        );
    }

    bookingRepository.deleteByEventId(id);
    eventRepository.delete(event);
}


@Transactional
public EventResponse updateEvent(Long id, Event updatedEvent) {

    Event existing = eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();

    User currentUser = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    
    if (!existing.getOrganizer().getId().equals(currentUser.getId())
           ) {

        throw new AccessDeniedException("You are not allowed to update this event");
    }

    existing.setTitle(updatedEvent.getTitle());
    existing.setDescription(updatedEvent.getDescription());
    existing.setCategory(updatedEvent.getCategory());
    existing.setCity(updatedEvent.getCity());
    existing.setEventDate(updatedEvent.getEventDate());
    existing.setStartTime(updatedEvent.getStartTime());
    existing.setEndTime(updatedEvent.getEndTime());
    existing.setPrice(updatedEvent.getPrice());

    Integer sold = bookingRepository.getTotalConfirmedSeats(existing.getId());
    int bookedSeats = (sold != null) ? sold : 0;

    int newTotalSeats = updatedEvent.getTotalSeats();

    if (newTotalSeats < bookedSeats) {
        throw new IllegalArgumentException(
                "Total seats cannot be less than already booked seats (" + bookedSeats + ")"
        );
    }

    existing.setTotalSeats(newTotalSeats);

    Event saved = eventRepository.save(existing);

    List<Booking> bookings =
            bookingRepository.findByEventIdAndStatus(
                    id,
                    BookingStatus.CONFIRMED
            );

    for (Booking booking : bookings) {
        notificationService.createNotification(
                booking.getUserId(),
                "Event \"" + saved.getTitle() +
                "\" has been updated. Please check the latest details."
        );
    }

    return mapToResponse(saved);
}



public EventResponse mapToResponse(Event event) {

    EventResponse response = new EventResponse();

    response.setId(event.getId());
    response.setTitle(event.getTitle());
    response.setDescription(event.getDescription());
    response.setCity(event.getCity());
    response.setCategory(event.getCategory());
    response.setEventDate(event.getEventDate());
    response.setPrice(event.getPrice() != null ? event.getPrice() : 0.0);

    response.setTotalSeats(event.getTotalSeats());

  
    
    Integer sold = bookingRepository.getTotalConfirmedSeats(event.getId());
    int totalSold = (sold != null) ? sold : 0;

    int availableSeats = event.getTotalSeats() - totalSold;
    response.setAvailableSeats(availableSeats);

    response.setStartTime(event.getStartTime());
    response.setEndTime(event.getEndTime());

    if (event.getOrganizer() != null) {
        response.setOrganizerId(event.getOrganizer().getId());
        response.setOrganizerName(event.getOrganizer().getUsername());
    }

    return response;
}
}