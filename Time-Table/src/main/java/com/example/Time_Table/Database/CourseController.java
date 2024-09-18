package com.example.Time_Table.controller;

import com.example.Time_Table.model.Course;
import com.example.Time_Table.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // 모든 수업 정보 가져오기 (Thymeleaf 템플릿 사용)
    @GetMapping("/all")
    public String getAllCourses(Model model) {
        List<Course> courses = courseService.getAllCourses();
        model.addAttribute("courses", courses); // courses라는 이름으로 데이터를 전달
        return "courseList"; // templates/courseList.html로 렌더링
    }

    @PostMapping("/add")
    public Course createCourse(@RequestBody Course course) {
        return courseService.saveCourse(course);
    }

    // 사용자 조건에 맞는 시간표 조합을 찾는 API 엔드포인트
    @GetMapping("/filtered")
    public List<List<Course>> getFilteredCombinations(
            @RequestParam(required = false) List<String> daysOfWeek, // 예: ["월", "화"]
            @RequestParam(required = false) Double startTime, // 예: 9.0
            @RequestParam(required = false) Double endTime, // 예: 17.0
            @RequestParam(required = false) String professorName, // 예: "김교수"
            @RequestParam(required = false) String courseName // 예: "프로그래밍"
            @RequestParam(required = false) String division // 예: "전선"
            @RequestParam(required = false) int credit // 예: "3"
            @RequestParam(required = false) String departmentName // 과 이름 추가
            Model model // Thymeleaf 템플릿에 데이터를 전달하기 위한 Model 객체
    ) {
        // 필터링된 조합을 찾기 위해 서비스 메서드를 호출
        List<List<Course>> filteredCombinations = courseService.findFilteredCombinations(
                daysOfWeek, startTime, endTime, professorName, courseName, division, credit, departmentName
        );

        model.addAttribute("filteredCombinations", filteredCombinations); // Thymeleaf 템플릿에 데이터 전달
        return "timetable"; // templates/timetable.html로 렌더링
    }
}
