package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.Booking;
import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.enums.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);


    List<Booking> findByEvent_EventDateAndStatusAndReminderSentFalse(
            LocalDate eventDate,
            BookingStatus status
    );


	void deleteByEventId(Long id);


	List<Booking> findByEventId(Long eventId);

	@Query("""
			SELECT SUM(b.quantity)
			FROM Booking b
			WHERE b.event.id = :eventId
			AND b.status = com.example.eventmanagement.entity.enums.BookingStatus.CONFIRMED
			""")
			public Integer getTotalConfirmedSeats(@Param("eventId") Long eventId);


	List<Booking> findByEventIdAndStatus(Long id, BookingStatus confirmed);
    }