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
        // 모든 수업 데이터를 가져옴
        List<Courses> allCourses = courseRepository.findBySearchCriteria(department, division, credit, searchOption, searchQuery);

        // 수업 병합 작업
        List<Courses> mergedCourses = mergeCourses(allCourses);

        // 시간 조건을 이용한 필터링
        if (selectedTimes != null && !selectedTimes.isEmpty()) {
            mergedCourses = mergedCourses.stream()
                    .filter(course -> isTimeWithinSelectedTimes(course, selectedTimes))
                    .collect(Collectors.toList());
        }

        System.out.println("Final filtered courses count after time filter: " + mergedCourses.size());

        return mergedCourses;
    }

    private List<Courses> mergeCourses(List<Courses> courses) {
        List<Courses> mergedList = new ArrayList<>();

        for (int i = 0; i < courses.size(); i++) {
            Courses currentCourse = courses.get(i);
            StringBuilder timeString = new StringBuilder(formatCourseTime(currentCourse));

            // 다음 수업과 동일한 수업인지 확인
            while (i + 1 < courses.size()) {
                Courses nextCourse = courses.get(i + 1);

                // 동일한 수업인지 확인 (과, 교수명, 학점, 강의실 등 비교)
                if (isSameCourse(currentCourse, nextCourse)) {
                    // 동일 수업의 시간을 병합
                    timeString.append(", ").append(formatCourseTime(nextCourse));
                    i++; // 이미 병합했으므로 다음 항목을 건너뜀
                } else {
                    break;
                }
            }

            // 병합된 시간 설정
            currentCourse.setFormattedTime(timeString.toString());
            mergedList.add(currentCourse);
        }

        return mergedList;
    }

    private boolean isSameCourse(Courses course1, Courses course2) {
        // 과, 수업 코드, 교수명, 학점, 강의실 등이 모두 동일한지 확인하여 동일 수업인지 판단
        return course1.getDepartmentName().equals(course2.getDepartmentName()) &&
                course1.getCourseCode().equals(course2.getCourseCode()) &&
                course1.getCourseName().equals(course2.getCourseName()) &&
                course1.getCourseNumber().equals(course2.getCourseNumber()) &&
                course1.getProfessorName().equals(course2.getProfessorName()) &&
                course1.getCredit().equals(course2.getCredit()) &&
                course1.getDivision().equals(course2.getDivision()) &&
                course1.getCapacity().equals(course2.getCapacity()) &&
                course1.getClassroom().equals(course2.getClassroom());
    }

    private String formatCourseTime(Courses course) {
        return course.getStartPeriod()==(course.getEndPeriod())
                ? course.getDayOfWeek() + " " + course.getStartPeriod()
                : course.getDayOfWeek() + " " + course.getStartPeriod() + "-" + course.getEndPeriod();
    }

    // 시간 포함 여부 확인 메서드 (Courses 객체를 매개변수로 받음)
    private boolean isTimeWithinSelectedTimes(Courses course, List<String> selectedTimes) {
        String[] courseTimeSlots = course.getFormattedTime().split(", ");

        // 모든 선택한 시간대에 대해 비교
        for (String selectedTime : selectedTimes) {
            String[] selectedTimeSplit = selectedTime.split(" ");
            if (selectedTimeSplit.length != 2) continue;

            String selectedDay = selectedTimeSplit[0];
            String[] selectedPeriodRange = selectedTimeSplit[1].split("-");
            float selectedStartPeriod = Float.parseFloat(selectedPeriodRange[0]);
            float selectedEndPeriod = Float.parseFloat(selectedPeriodRange[1]);

            System.out.println("Selected time: " + selectedDay + " " + selectedStartPeriod + "-" + selectedEndPeriod);

            // 강의 시간대와 비교
            boolean isMatched = false;
            for (String timeSlot : courseTimeSlots) {
                if (!timeSlot.contains(" ")) continue;

                String[] courseTimeSplit = timeSlot.split(" ");
                if (courseTimeSplit.length != 2) continue;

                String courseDay = courseTimeSplit[0];
                String[] coursePeriodRange = courseTimeSplit[1].split("-");
                float courseStartPeriod = Float.parseFloat(coursePeriodRange[0]);
                float courseEndPeriod = Float.parseFloat(coursePeriodRange[1]);

                System.out.println("Comparing with course time: " + courseDay + " " + courseStartPeriod + "-" + courseEndPeriod);

                // 선택한 요일과 수업 요일이 같고, 선택한 시간대와 강의 시간대가 겹치는 경우
                if (selectedDay.equals(courseDay) &&
                        (selectedStartPeriod <= courseStartPeriod && selectedEndPeriod >= courseEndPeriod)) {
                    isMatched = true;
                    break; // 해당 시간대에 대해 조건이 일치하면 반복 종료
                }
            }

            if (!isMatched) {
                System.out.println("No match found for selected time: " + selectedTime);
                return false; // 하나라도 조건에 맞지 않으면 false 반환
            }
        }

        return true; // 모든 시간대가 조건에 맞는 경우 true 반환
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
