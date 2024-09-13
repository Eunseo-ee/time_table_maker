package com.example.Time_Table.controller;

import com.example.Time_Table.model.Course;
import com.example.Time_Table.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/all")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/add")
    public Course createCourse(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }
}
