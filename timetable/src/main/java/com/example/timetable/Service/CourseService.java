package com.example.timetable.Service;

import com.example.timetable.model.Courses;
import com.example.timetable.repository.CourseRepository;
import com.example.timetable.repository.DepartmentRepository;
import com.example.timetable.model.Departments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.stream.Collectors;  // Collectors 클래스 import
import java.util.stream.Stream;      // Stream 클래스 import
import java.util.Arrays;             // Arrays 클래스 import


import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DepartmentRepository departmentRepository; // DepartmentRepository 주입

    public List<Courses> getAllCourses() {
        return courseRepository.findAll();
    }

    // 새로운 수업을 저장하는 메서드
    public Courses saveCourse(Courses course) {
        return courseRepository.save(course); // static 제거 후 인스턴스를 통해 호출
    }

    // 필터링된 강의 목록을 가져오는 메소드
    public List<Courses> getFilteredCourses(String department, String division, Integer credit, String searchOption, String searchQuery, List<String> selectedTimes) {
        List<Courses> filteredCourses = courseRepository.findBySearchCriteria(department, division, credit, searchOption, searchQuery);

        // 초기 필터링 로그
        System.out.println("Initial filtered courses count: " + filteredCourses.size());

        if (selectedTimes != null && !selectedTimes.isEmpty()) {
            System.out.println("Selected times for filtering: " + selectedTimes);

            // 필터링 과정에서 각 강의를 대상으로 필터 적용 결과 출력
            filteredCourses = filteredCourses.stream()
                    .filter(course -> {
                        boolean isWithinTime = isTimeWithinSelectedTimes(course, selectedTimes);
                        System.out.println("Course: " + course.getCourseName() + ", Time: " + course.getFormattedTime() + " -> " + (isWithinTime ? "Included" : "Excluded"));
                        return isWithinTime;
                    })
                    .collect(Collectors.toList());
        }

        // 최종 필터링 결과 로그
        System.out.println("Final filtered courses count after time filter: " + filteredCourses.size());

        return filteredCourses;
    }

    // 시간 포함 여부 확인 메서드 (Courses 객체를 매개변수로 받음)
    private boolean isTimeWithinSelectedTimes(Courses course, List<String> selectedTimes) {
        // 예: "월 1.0-3.0, 목 3.0-5.0" 형식으로 여러 요일과 시간을 가진 강의 처리
        String[] courseTimeSlots = course.getFormattedTime().split(", ");

        for (String timeSlot : courseTimeSlots) {
            String[] courseTimeSplit = timeSlot.split(" ");
            String courseDay = courseTimeSplit[0];
            String[] coursePeriodRange = courseTimeSplit[1].split("-");
            float courseStartPeriod = Float.parseFloat(coursePeriodRange[0]);
            float courseEndPeriod = Float.parseFloat(coursePeriodRange[1]);

            for (String selectedTime : selectedTimes) {
                String[] selectedTimeSplit = selectedTime.split(" ");
                String selectedDay = selectedTimeSplit[0];
                String[] selectedPeriodRange = selectedTimeSplit[1].split("-");
                float selectedStartPeriod = Float.parseFloat(selectedPeriodRange[0]);
                float selectedEndPeriod = Float.parseFloat(selectedPeriodRange[1]);

                // 선택한 요일과 수업 요일이 같고, 선택한 시간대가 강의 시간대와 겹치는 경우를 확인
                if (selectedDay.equals(courseDay) &&
                        ((selectedStartPeriod <= courseStartPeriod && selectedEndPeriod >= courseEndPeriod))) {
                    return true;
                }
            }
        }
        return false;
    }

    // 필터링된 조합 찾기 메서드
    public List<List<Courses>> findFilteredCombinations(
            List<String> daysOfWeek, Float startTime, Float endTime, String professorName, String courseName, String division, int credit, String departmentName) {

        Long department_id = null;

        // Department name으로 department_id 조회
        if (departmentName != null && !departmentName.isEmpty()) {
            Departments department = departmentRepository.findByName(departmentName);
            if (department != null) {
                department_id = department.getId();
            } else {
                System.out.println("해당 과가 존재하지 않습니다: " + departmentName);  // 과가 존재하지 않을 때 로그 출력
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
            if (isValidCombination(combination, daysOfWeek, startTime, endTime, professorName, courseName, division, credit, departmentName)) {
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

    public void removeWhitespaceInClassroom() {
        List<Courses> courses = courseRepository.findAll();

        for (Courses course : courses) {
            String classroom = course.getClassroom();
            if (classroom != null && !classroom.isEmpty()) {
                // 공백을 기준으로 첫 번째 부분만 가져옴
                String updatedClassroom = classroom.split(" ")[0];
                course.setClassroom(updatedClassroom);  // 공백 이후 제거한 값 설정
            }
        }

        // 변경된 데이터를 저장
        courseRepository.saveAll(courses);
    }
}
