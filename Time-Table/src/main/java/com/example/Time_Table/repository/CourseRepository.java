package com.example.Time_Table.repository;

import com.example.Time_Table.model.Courses;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Courses, Long> {
}
