package com.example.Time_Table.repository;

import com.example.Time_Table.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
