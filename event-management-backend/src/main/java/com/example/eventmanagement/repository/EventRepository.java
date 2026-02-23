package com.example.eventmanagement.repository;

import com.example.eventmanagement.entity.Event;
import com.example.eventmanagement.entity.enums.EventStatus;
import com.example.eventmanagement.entity.enums.EventVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

	

	List<Event> findByOrganizer_Id(Long organizerId);	
	
    List<Event> findByCityIgnoreCase(String city);

    List<Event> findByCategoryIgnoreCase(String category);

  
//    @Lock(LockModeType.PESSIMISTIC_WRITE)
//    @Query("SELECT e FROM Event e WHERE e.id = :id")
//    Event findByIdForUpdate(@Param("id") Long id);
}