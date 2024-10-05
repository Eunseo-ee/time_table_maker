package com.example.timetable.repository;

import com.example.timetable.model.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Courses, Long> {
    @Query("SELECT c FROM Courses c WHERE "
            + "(:department IS NULL OR c.department_id  = :department) AND "
            + "(:division IS NULL OR c.division = :division) AND "
            + "(:credit IS NULL OR c.credit = :credit) AND "
            + "(COALESCE(:searchOption, '') = '' OR "
            + "(CASE WHEN :searchOption = 'courseName' THEN c.courseName "
            + "WHEN :searchOption = 'professorName' THEN c.professorName "
            + "WHEN :searchOption = 'courseCode' THEN c.courseCode "
            + "WHEN :searchOption = 'classroom' THEN c.classroom ELSE '' END) LIKE %:searchQuery%)")
    List<Courses> findBySearchCriteria(String department, String division, Integer credit, String searchOption, String searchQuery);
}