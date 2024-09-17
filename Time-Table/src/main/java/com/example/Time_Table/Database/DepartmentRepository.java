package com.example.Time_Table.repository;

import com.example.Time_Table.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Department findByName(String name); // 과 이름으로 Department 조회
}