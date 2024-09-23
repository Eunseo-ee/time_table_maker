package com.example.TimeTable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.Time_Table.model"})
@EnableJpaRepositories(basePackages = "com.example.TimeTable.repository")
public class TimeTableApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimeTableApplication.class, args);
	}

}