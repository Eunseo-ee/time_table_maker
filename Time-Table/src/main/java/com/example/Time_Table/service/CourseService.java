package com.example.Time_Table.service;

import com.example.Time_Table.model.Courses;
import com.example.Time_Table.repository.CourseRepository;
import com.example.Time_Table.repository.DepartmentRepository;
import com.example.Time_Table.model.Departments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DepartmentRepository departmentRepository; // DepartmentRepository 주입

    // 모든 수업을 불러오는 메서드
    public List<Courses> getAllCourses() {
        return courseRepository.findAll(); // static 제거 후 인스턴스를 통해 호출
    }

    // 새로운 수업을 저장하는 메서드
    public Courses saveCourse(Courses course) {
        return courseRepository.save(course); // static 제거 후 인스턴스를 통해 호출
    }

    // 필터링된 조합 찾기 메서드
    public List<List<Courses>> findFilteredCombinations(List<String> daysOfWeek, Float startPeriod, Float endPeriod, String professorName, String courseName, String division, int credit, String departmentName) {
        // 1. 과 이름을 통해 department_id를 조회
        Long department_id = null;
        if (departmentName != null) {
            Departments department = departmentRepository.findByName(departmentName); // repository 인스턴스 사용
            if (department != null) {
                department_id = department.getId();
            }
        }

        // 2. 모든 수업 데이터 조회
        List<Courses> allCourses = courseRepository.findAll(); // repository 인스턴스 사용
        List<List<Courses>> validCombinations = new ArrayList<>();

        // 3. 모든 가능한 조합을 생성
        for (Courses course1 : allCourses) {
            if (department_id != null && !Long.valueOf(course1.getDepartmentId()).equals(department_id)) continue;

            List<Courses> combination = new ArrayList<>();
            combination.add(course1);

            for (Courses course2 : allCourses) {
                if (!course1.equals(course2) && !isTimeOverlap(course1, course2)) {
                    combination.add(course2);
                }
            }

            // 4. 조합이 사용자의 조건에 맞는지 확인
            if (isValidCombination(combination, daysOfWeek, startPeriod, endPeriod, professorName, courseName, division, credit, departmentName)) {
                validCombinations.add(combination);
            }
        }

        return validCombinations;
    }

    // 두 수업의 시간이 겹치는지 확인
    private boolean isTimeOverlap(Courses course1, Courses course2) {
        if (!course1.getDayOfWeek().equals(course2.getDayOfWeek())) {
            return false;
        }
        return !(course1.getEndPeriod() <= course2.getStartPeriod() || course2.getEndPeriod() <= course1.getStartPeriod());
    }

    // 조합이 사용자의 조건에 맞는지 확인
    private boolean isValidCombination(List<Courses> combination, List<String> daysOfWeek, Float startPeriod,
                                       Float endPeriod, String professorName, String courseName, String division, Integer credit, String departmentName) {
        for (Courses course : combination) {
            if (daysOfWeek != null && !daysOfWeek.contains(course.getDayOfWeek())) return false;
            if (startPeriod != null && course.getStartPeriod() < startPeriod) return false;
            if (endPeriod != null && course.getEndPeriod() > endPeriod) return false;
            if (professorName != null && !course.getProfessorName().equals(professorName)) return false;
            if (courseName != null && !course.getCourseName().equals(courseName)) return false;
            if (division != null && !course.getDivision().equals(division)) return false;
        }
        return true;
    }
}
