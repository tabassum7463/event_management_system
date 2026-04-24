package com.example.eventmanagement.security;

import com.example.eventmanagement.exception.CustomAccessDeniedHandler;
import com.example.eventmanagement.exception.CustomAuthenticationEntryPoint;
import com.example.eventmanagement.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



	@Configuration
	@EnableMethodSecurity
	@EnableWebSecurity
	public class SecurityConfig {

	    private final CustomUserDetailsService userDetailsService;
	    private final JwtAuthenticationFilter jwtAuthFilter;
	    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
	    private final CustomAccessDeniedHandler customAccessDeniedHandler;

	    public SecurityConfig(CustomUserDetailsService userDetailsService,
	                          JwtAuthenticationFilter jwtAuthFilter,CustomAuthenticationEntryPoint customAuthenticationEntryPoint, CustomAccessDeniedHandler customAccessDeniedHandler) {
	        this.userDetailsService = userDetailsService;
	        this.jwtAuthFilter = jwtAuthFilter;
	        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
	        this.customAccessDeniedHandler=customAccessDeniedHandler;

	    }

	

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
        
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN") 
                .requestMatchers("/api/events/organizer/**").hasAnyRole("ORGANIZER","ADMIN")
                .requestMatchers("/api/events/**").hasAnyRole("USER","ADMIN","ORGANIZER")
                .requestMatchers("/api/bookings/**").hasAnyRole("USER","ADMIN","ORGANIZER")
                .requestMatchers("/api/notifications/**").hasAnyRole("USER","ADMIN","ORGANIZER")
                .anyRequest().authenticated()
            )
            
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
                    .accessDeniedHandler(customAccessDeniedHandler)

                )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}