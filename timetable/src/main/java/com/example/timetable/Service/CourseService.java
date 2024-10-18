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
        List<Courses> filteredCourses = courseRepository.findBySearchCriteria(department, division, credit, searchOption, searchQuery);

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
    public boolean isTimeWithinSelectedTimes(Courses course, List<String> selectedTimes) {
        String[] courseTimeSlots = course.getFormattedTime().split(", ");
        System.out.println(course.getCourseName());
        System.out.println("Selected times for filtering: " + selectedTimes);
        System.out.println("Course time slots: " + Arrays.toString(courseTimeSlots));

        // 각 강의 시간대에 대해 선택된 시간대와 비교
        for (String timeSlot : courseTimeSlots) {
            System.out.println("Processing course time slot: " + timeSlot);
            String[] courseTimeSplit = timeSlot.split(" ");

            String courseDay = courseTimeSplit[0];
            String[] coursePeriodRange = courseTimeSplit[1].split("-");

            float courseStartPeriod;
            float courseEndPeriod;
            courseStartPeriod = Float.parseFloat(coursePeriodRange[0]);
            courseEndPeriod = Float.parseFloat(coursePeriodRange[1]);

            boolean matchFound = false;  // 현재 강의 시간대에 대해 선택된 시간대와 일치하는 것이 있는지 추적

            // 각 선택된 시간대와 강의 시간대를 비교
            for (String selectedTime : selectedTimes) {

                String[] selectedTimeSplit = selectedTime.split(" ");

                String selectedDay = selectedTimeSplit[0];
                String[] selectedPeriodRange = selectedTimeSplit[1].split("-");

                float selectedStartPeriod;
                float selectedEndPeriod;
                selectedStartPeriod = Float.parseFloat(selectedPeriodRange[0]);
                selectedEndPeriod = Float.parseFloat(selectedPeriodRange[1]);

                // 선택된 시간대와 강의 시간대가 일치하는지 확인
                if (selectedDay.equals(courseDay) &&
                        (selectedStartPeriod <= courseStartPeriod && selectedEndPeriod >= courseEndPeriod)) {
                    matchFound = true; // 일치하는 시간대가 있는 경우 true로 설정
                    System.out.println("Match found for selected time: " + selectedTime);
                    break;  // 현재 강의 시간대에 대해 매칭되면 더 이상 비교하지 않음
                }
            }

            if (!matchFound) {
                // 현재 강의 시간대에 대해 일치하는 선택된 시간대가 하나도 없는 경우 false 반환
                System.out.println("No match found for time slot: " + timeSlot);
                return false;
            }
        }
        System.out.println("All selected times matched successfully");
        // 모든 강의 시간대가 선택된 시간대와 일치하는 경우 true 반환
        return true;
    }

    // 필터링된 조합 찾기 메서드
    public List<List<Courses>> findFilteredCombinations(
            String department, List<String> courseNames, Integer totalCredits, List<String> availableTimes, List<String> requiredCourses) {

        List<Courses> filteredCombination= getAllCourses();
        List<List<Courses>> combinations = new ArrayList<>();

        if(department != null && !department.isEmpty()) {
            filteredCombination = filteredCombination.stream()
                    .filter(course -> course.getDepartmentName().equals(department))
                    .collect(Collectors.toList());
        }

        if (courseNames != null && !courseNames.isEmpty()) {
            filteredCombination = filteredCombination.stream()
                    .filter(course -> courseNames.contains(course.getCourseName()))
                    .collect(Collectors.toList());
        }

        if (availableTimes != null && !availableTimes.isEmpty()) {
            System.out.println("Selected times for filtering: " + availableTimes);

            // 필터링 과정에서 각 강의를 대상으로 필터 적용 결과 출력
            filteredCombination = filteredCombination.stream()
                    .filter(course -> {
                        boolean isWithinTime = isTimeWithinSelectedTimes(course, availableTimes);
                        System.out.println("Course: " + course.getCourseName() + ", Time: " + course.getFormattedTime() + " -> " + (isWithinTime ? "Included" : "Excluded"));
                        return isWithinTime;
                    })
                    .collect(Collectors.toList());
        }
        // 필수 강의 필터링
        List<Courses> requiredCoursesList = filteredCombination.stream()
                .filter(course -> requiredCourses.contains(course.getCourseName()))
                .collect(Collectors.toList());

        // 필수 강의가 조건에 맞지 않는 경우 빈 조합 반환
        if (requiredCoursesList.isEmpty()) {
            System.out.println("No required courses found in the filtered list");
            return combinations;
        }

        // 총 학점에 맞는 강의 조합 생성
        generateCombinations(filteredCombination, requiredCoursesList, totalCredits, new ArrayList<>(), combinations);

        return combinations;
    }

    private void generateCombinations(List<Courses> availableCourses, List<Courses> requiredCourses, Integer totalCredits,
                                      List<Courses> currentCombination, List<List<Courses>> allCombinations) {
        int currentCredits = currentCombination.stream().mapToInt(Courses::getCredit).sum();

        // 총 학점 조건을 만족하는 경우 조합에 추가
        if (currentCredits >= totalCredits) {
            allCombinations.add(new ArrayList<>(currentCombination));
            return;
        }

        // 필수 강의가 아직 추가되지 않은 경우 추가
        for (Courses requiredCourse : requiredCourses) {
            if (!currentCombination.contains(requiredCourse)) {
                currentCombination.add(requiredCourse);
            }
        }

        // 남은 강의 중에서 조합 생성
        for (Courses course : availableCourses) {
            if (!currentCombination.contains(course)) {
                currentCombination.add(course);
                generateCombinations(availableCourses, requiredCourses, totalCredits, currentCombination, allCombinations);
                currentCombination.remove(course);
            }
        }
    }
}
