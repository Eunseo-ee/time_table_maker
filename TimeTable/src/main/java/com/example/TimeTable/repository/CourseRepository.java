package com.example.TimeTable.repository;

import com.example.TimeTable.model.Courses;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Courses, Long> {
}