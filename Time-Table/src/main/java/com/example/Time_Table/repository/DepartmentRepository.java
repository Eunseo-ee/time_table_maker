package com.example.Time_Table.repository;

import com.example.Time_Table.model.Departments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Departments, Long> {
    Departments findByName(String name); // 과 이름으로 Department 조회
}