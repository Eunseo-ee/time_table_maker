package com.example.timetable.controller;

import com.example.timetable.model.Courses;
import com.example.timetable.Service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RequestMapping("/api/courses")

@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:63342"})

//@CrossOrigin(origins = {"http://localhost:8080", "http://anotherdomain.com"})

public class CoursesController {

    @Autowired
    private CourseService courseService;

    // 모든 수업 정보 가져오기 (Thymeleaf 템플릿 사용)
    @GetMapping("/api/courses/all")
    public String getAllCourses(Model model) {
        List<Courses> courses = courseService.getAllCourses();
        model.addAttribute("courses", courses); // courses라는 이름으로 데이터를 전달
        return "view"; // templates/courseList.html로 렌더링
    }

    @PostMapping("/api/courses/add")
    public Courses createCourse(@RequestBody Courses course) {
        return courseService.saveCourse(course);
    }

    // 사용자 조건에 맞는 시간표 조합을 찾는 API 엔드포인트
    @GetMapping("/api/courses/filtered")
    public String getFilteredCombinations(
            @RequestParam(required = false) List<String> daysOfWeek, // 예: ["월", "화"]
            @RequestParam(required = false) Float startTime, // 예: 9.0
            @RequestParam(required = false) Float endTime, // 예: 17.0
            @RequestParam(required = false) String professorName, // 예: "김교수"
            @RequestParam(required = false) String courseName, // 예: "프로그래밍"
            @RequestParam(required = false) String division, // 예: "전선"
            @RequestParam(required = false) int credit, // 예: "3"
            @RequestParam(required = false) String departmentName, // 과 이름 추가
            Model model // Thymeleaf 템플릿에 데이터를 전달하기 위한 Model 객체
    ) {
        // 필터링된 조합을 찾기 위해 서비스 메서드를 호출
        List<List<Courses>> filteredCombinations = courseService.findFilteredCombinations(
                daysOfWeek, startTime, endTime, professorName, courseName, division, credit, departmentName
        );

        model.addAttribute("filteredCombinations", filteredCombinations); // Thymeleaf 템플릿에 데이터 전달
        return "view"; // templates/timetable.html로 렌더링
    }
    @GetMapping("/api/courses/list")
    public List<Courses> getCourses() {
        // 모든 강의 데이터를 반환
        return courseService.getAllCourses();
    }


}
