package com.example.timetable.controller;

import com.example.timetable.model.Courses;
import com.example.timetable.Service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class TimetableController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/timetable")
    public String showTimeTable(Model model) {
        // 데이터베이스에서 필요한 데이터 가져오기
        List<Courses> courses = courseService.getAllCourses();

        // 가져온 데이터를 모델에 추가하여 Thymeleaf 템플릿으로 전달
        model.addAttribute("courses", courses);

        // templates/timetable.html 파일을 렌더링
        return "timetable";
    }
}
