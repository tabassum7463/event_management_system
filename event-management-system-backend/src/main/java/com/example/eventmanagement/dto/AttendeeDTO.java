package com.example.eventmanagement.dto;

public class AttendeeDTO {

    private Long bookingId;
    private String name;
    private String email;
    private Integer quantity;

    public AttendeeDTO(Long bookingId, String name, String email, Integer quantity) {
        this.bookingId = bookingId;
        this.name = name;
        this.email = email;
        this.quantity = quantity;
    }

    public Long getBookingId() { return bookingId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Integer getQuantity() { return quantity; }
}