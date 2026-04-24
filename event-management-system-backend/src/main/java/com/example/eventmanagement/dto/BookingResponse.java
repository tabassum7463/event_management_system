package com.example.eventmanagement.dto;
import java.time.LocalDate; 
import java.time.LocalDateTime; 
public class BookingResponse { 
	private Long id;
	private int quantity;
	private double totalPrice;
	private String status; 
	private LocalDateTime bookedAt;
	private EventResponse event; 
	public Long getId() 
	{
		return id; 
	
	} 
	public void setId(Long id) { 
		this.id = id; 
	}
	public int getQuantity() { 
		return quantity;
		
	} 
	public void setQuantity(int quantity) { this.quantity = quantity; } 
	public double getTotalPrice() { return totalPrice; } 
	public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
	public LocalDateTime getBookedAt() { return bookedAt; }
	public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
	public EventResponse getEvent() { return event; } 
	public void setEvent(EventResponse event) { this.event = event; } 
	}