package com.example.TimeTable.repository;

import com.example.TimeTable.model.Departments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Departments, Long> {
    Departments findByName(String name); // 과 이름으로 Department 조회
}
