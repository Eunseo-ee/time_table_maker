package com.example.Time_Table.service;

import com.example.Time_Table.model.Course;
import com.example.Time_Table.repository.CourseRepository;
import com.example.Time_Table.repository.DepartmentRepository;
import com.example.Time_Table.model.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DepartmentRepository departmentRepository; // DepartmentRepository 주입

    // 모든 수업을 불러오는 메서드
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    // 새로운 수업을 저장하는 메서드
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public List<List<Course>> findFilteredCombinations(List<String> daysOfWeek, Double startTime, Double endTime, String professorName, String courseName, String departmentName) {
        // 1. 과 이름을 통해 department_id를 조회
        Integer departmentId = null;
        if (departmentName != null) {
            Department department = departmentRepository.findByName(departmentName);
            if (department != null) {
                departmentId = department.getId();
            }
        }

        // 2. 모든 수업 데이터 조회
        List<Course> allCourses = courseRepository.findAll();
        List<List<Course>> validCombinations = new ArrayList<>();

        // 3. 모든 가능한 조합을 생성
        for (Course course1 : allCourses) {
            if (departmentId != null && !course1.getDepartmentId().equals(departmentId)) continue; // department_id에 맞는 필터링

            List<Course> combination = new ArrayList<>();
            combination.add(course1);

            for (Course course2 : allCourses) {
                if (!course1.equals(course2) && !isTimeOverlap(course1, course2)) {
                    combination.add(course2);
                }
            }

            // 4. 조합이 사용자의 조건에 맞는지 확인
            if (isValidCombination(combination, daysOfWeek, startTime, endTime, professorName, courseName, division, credit, departmentName)) {
                validCombinations.add(combination);
            }
        }

        return validCombinations;
    }

    // 두 수업의 시간이 겹치는지 확인
    private boolean isTimeOverlap(Course course1, Course course2) {
        if (!course1.getDayOfWeek().equals(course2.getDayOfWeek())) {
            return false;
        }
        return !(course1.getEndPeriod() <= course2.getStartPeriod() || course2.getEndPeriod() <= course1.getStartPeriod());
    }

    // 조합이 사용자의 조건에 맞는지 확인
    private boolean isValidCombination(List<Course> combination, List<String> daysOfWeek, Double startTime, Double endTime, String professorName, String courseName, String division, int credit, String departmentName) {
        // 조건에 따른 필터링 로직 추가
        for (Course course : combination) {
            if (daysOfWeek != null && !daysOfWeek.contains(course.getDayOfWeek())) {
                return false;
            }
            if (startTime != null && course.getStartPeriod() < startTime) {
                return false;
            }
            if (endTime != null && course.getEndPeriod() > endTime) {
                return false;
            }
            if (professorName != null && !course.getProfessorName().equals(professorName)) {
                return false;
            }
            if (courseName != null && !course.getCourseName().equals(courseName)) {
                return false;
            }
            if (division != null && !course.getdivision().equals(division)) {
                return false;
            }
            if (credit != null && !course.getcredit().equals(credit)) {
                return false;
            }
            if (departmentName != null && !course.getdepartmentName().equals(departmentName)) {
                return false;
            }
        }
        return true;
    }
}
