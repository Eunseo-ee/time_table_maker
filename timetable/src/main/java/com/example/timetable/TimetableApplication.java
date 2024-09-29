package com.example.timetable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.example.timetable.model")
@ComponentScan(basePackages = { "com.example.timetable.model" })
@EnableJpaRepositories("com.example.timetable.repository")
public class TimetableApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimetableApplication.class, args);
	}

}
