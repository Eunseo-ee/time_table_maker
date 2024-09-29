package com.example.timetable.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/view")
    public String showViewPage() {
        // view.html을 반환
        return "view";  // templates/view.html을 반환
    }

    @GetMapping("/")
    public String home() {
        // 기본 경로에서 view.html로 리다이렉트
        return "redirect:/view";
    }
}
