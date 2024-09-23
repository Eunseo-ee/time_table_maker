package com.example.TimeTable.Controller;

import com.example.TimeTable.model.Departments;
import com.example.TimeTable.Service.DepartmentService;
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
