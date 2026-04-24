package com.example.eventmanagement.exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {

    	ObjectMapper mapper = new ObjectMapper();

    	Map<String, Object> error = new HashMap<>();
    	error.put("status", 403);
    	error.put("error", "FORBIDDEN");
    	error.put("message", ex.getMessage());

    	response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    	response.setContentType("application/json");

    	mapper.writeValue(response.getWriter(), error);
    }
}