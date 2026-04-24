package com.example.eventmanagement.scheduler;

import com.example.eventmanagement.entity.Booking;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.enums.BookingStatus;
import com.example.eventmanagement.repository.BookingRepository;
import com.example.eventmanagement.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class EventReminderScheduler {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public EventReminderScheduler(BookingRepository bookingRepository,
                                  NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 35 12 * * ?")
    public void sendUpcomingEventReminders() {

        LocalDate tomorrow = LocalDate.now().plusDays(2);

        List<Booking> bookings =
                bookingRepository.findByEvent_EventDateAndStatusAndReminderSentFalse(
                        tomorrow,
                        BookingStatus.CONFIRMED
                );

        for (Booking booking : bookings) {

            Event event = booking.getEvent();

            String message = "🔔 Reminder: Your event \""
                    + event.getTitle()
                    + "\" is tomorrow at "
                    + event.getStartTime()
                    + ".";

            notificationService.createNotification(
                    booking.getUserId(),
                    message
            );

            // ✅ Prevent duplicate reminders
            booking.setReminderSent(true);
        }

        bookingRepository.saveAll(bookings);
    }
}