package com.example.Time_Table.service;

import com.example.Time_Table.model.Department;
import com.example.Time_Table.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;
    // 데이터 접근 객체 주입받음

    public List<Department> getAllDepartments() {
        // findAll 메소드 호출해 데이터베이스에서 모든 Course 데이터 조회->리스트 형식으로 반환
        return departmentRepository.findAll();
    }

    public Department saveDepartment(Department department) {
        //주어진 엔티티 객체를 데이터베이스에 저장하거나, 이미 존재하는 경우 업데이트
        return departmentRepository.save(department);
    }
}
