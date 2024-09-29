package com.example.timetable.repository;

import com.example.timetable.model.Departments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Departments, Long> {
    Departments findByName(String name); // 과 이름으로 Department 조회
}
