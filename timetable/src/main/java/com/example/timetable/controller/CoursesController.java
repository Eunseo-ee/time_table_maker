package com.example.timetable.controller;

import com.example.timetable.model.Courses;
import com.example.timetable.Service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")

@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:63342"})

public class CoursesController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/test")
    public String testApi() {
        return "API is working!";
    }

    // 모든 수업 정보 가져오기 (Thymeleaf 템플릿 사용)
    @GetMapping("/courses")
    public String getAllCourses(Model model) {
        List<Courses> courses = courseService.getAllCourses();
        model.addAttribute("courses", courses);
        return "view";  // courses.html 템플릿으로 데이터 전달
    }

    @GetMapping("/list")
    public List<Courses> getCourse() {
        return courseService.getAllCourses();
    }

    @PostMapping("/add")
    public Courses createCourse(@RequestBody Courses course) {
        return courseService.saveCourse(course);
    }

    // 사용자 조건에 맞는 시간표 조합을 찾는 API 엔드포인트
    @GetMapping("/filtered")
    public List<Courses> getFilteredCourses(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String division,
            @RequestParam(required = false) Integer credit,
            @RequestParam(required = false) String searchOption,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) List<String> selectedTimes) {

        return courseService.getFilteredCourses(department, division, credit, searchOption, searchQuery, selectedTimes);
    }
}
