package com.example.eventmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class EventManagementBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventManagementBackendApplication.class, args);
	}

}
