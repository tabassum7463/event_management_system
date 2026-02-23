package com.example.eventmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.eventmanagement.entity.enums.BookingStatus;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private int quantity;

    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime bookedAt;

    @Column(name = "reminder_sent", nullable = false)
    private boolean reminderSent = false;
    
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public BookingStatus getStatus() {
		return status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public LocalDateTime getBookedAt() {
		return bookedAt;
	}

	public void setBookedAt(LocalDateTime bookedAt) {
		this.bookedAt = bookedAt;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}
	public boolean isReminderSent() {
	    return reminderSent;
	}

	public void setReminderSent(boolean reminderSent) {
	    this.reminderSent = reminderSent;
	}
    
}