package com.example.timetable.controller;

import com.example.timetable.model.Courses;
import com.example.timetable.Service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:63342"})
// 여기에 CORS 허용 도메인을 명시
public class TimetableController {

    public List<Courses> getCourses() {
        return courseService.getAllCourses();
    }

    @Autowired
    private CourseService courseService;
    @GetMapping("/")  // 루트 경로 요청을 처리
    public String home() {
        return "view";  // templates 폴더 안에 있는 index.html 파일을 반환
    }
    @GetMapping("/view")
    public String viewCourses(Model model) {
        List<Courses> courses = courseService.getAllCourses();
        model.addAttribute("courses", courses);
        return "view"; // view.html로 렌더링
    }


    @GetMapping("/timetable")
    public String showTimeTable(Model model) {
        // 데이터베이스에서 필요한 데이터 가져오기
        List<Courses> courses = courseService.getAllCourses();

        // 가져온 데이터를 모델에 추가하여 Thymeleaf 템플릿으로 전달
        model.addAttribute("courses", courses);

        // templates/timetable.html 파일을 렌더링
        return "view";
    }
}