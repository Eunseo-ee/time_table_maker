package com.example.Time_Table.controller;

import com.example.Time_Table.model.Departments;
import com.example.Time_Table.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/all")
    public List<Departments> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @PostMapping("/add")
    public Departments createDepartment(@RequestBody Departments department) {
        return departmentService.saveDepartment(department);
    }
}
