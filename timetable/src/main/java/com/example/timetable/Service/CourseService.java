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

        // 각 강의 시간대에 대해 선택된 시간대와 비교
        for (String timeSlot : courseTimeSlots) {
            String[] courseTimeSplit = timeSlot.split(" ");

            // 배열 길이 검사
            if (courseTimeSplit.length < 2) {
                System.out.println("Invalid time slot format for course: " + course.getCourseName() + ", timeSlot: " + timeSlot);
                return false;
            }

            String courseDay = courseTimeSplit[0];
            String[] coursePeriodRange = courseTimeSplit[1].split("-");

            if (coursePeriodRange.length < 2) {
                System.out.println("Invalid period range for course: " + course.getCourseName() + ", timeSlot: " + timeSlot);
                return false;
            }

            float courseStartPeriod;
            float courseEndPeriod;

            try {
                courseStartPeriod = Float.parseFloat(coursePeriodRange[0]);
                courseEndPeriod = Float.parseFloat(coursePeriodRange[1]);
            } catch (NumberFormatException e) {
                System.out.println("Invalid period format for course: " + course.getCourseName() + ", timeSlot: " + timeSlot);
                return false;
            }

            boolean matchFound = false;  // 현재 강의 시간대에 대해 선택된 시간대와 일치하는 것이 있는지 추적

            // 각 선택된 시간대와 강의 시간대를 비교
            for (String selectedTime : selectedTimes) {
                String[] selectedTimeSplit = selectedTime.split(" ");

                if (selectedTimeSplit.length < 2) {
                    System.out.println("Invalid selected time format: " + selectedTime);
                    continue; // 선택된 시간대 포맷이 유효하지 않은 경우 건너뜁니다.
                }

                String selectedDay = selectedTimeSplit[0];
                String[] selectedPeriodRange = selectedTimeSplit[1].split("-");

                if (selectedPeriodRange.length < 2) {
                    System.out.println("Invalid selected period range: " + selectedTime);
                    continue; // 선택된 시간대 범위가 유효하지 않은 경우 건너뜁니다.
                }

                float selectedStartPeriod;
                float selectedEndPeriod;

                try {
                    selectedStartPeriod = Float.parseFloat(selectedPeriodRange[0]);
                    selectedEndPeriod = Float.parseFloat(selectedPeriodRange[1]);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid selected period format: " + selectedTime);
                    continue; // 선택된 시간대 포맷이 유효하지 않은 경우 건너뜁니다.
                }

                if (selectedDay.equals(courseDay) &&
                        (selectedStartPeriod <= courseStartPeriod && selectedEndPeriod >= courseEndPeriod)) {
                    matchFound = true;
                    break;
                }
            }

            if (!matchFound) {
                // 현재 강의 시간대에 대해 일치하는 선택된 시간대가 하나도 없는 경우 false 반환
                return false;
            }
        }
        // 모든 강의 시간대가 선택된 시간대와 일치하는 경우 true 반환
        return true;
    }

    // 필터링된 조합 찾기 메서드
    public List<List<Courses>> findFilteredCombinations(
            int department_id, List<String> courseNames, Integer totalCredits, List<String> availableTimes, List<String> requiredCourses) {

        List<Courses> filteredCombination= getAllCourses();
        List<List<Courses>> combinations = new ArrayList<>();

        System.out.println("Before department filter, course count: " + filteredCombination.size());
        if(department_id != 0) {
            System.out.println(department_id);
            filteredCombination = filteredCombination.stream()
                    .filter(course -> course.getDepartmentId().equals(department_id))
                    .collect(Collectors.toList());
        }

        System.out.println("Before courseNames filter, course count: " + filteredCombination.size());
        if (courseNames != null && !courseNames.isEmpty()) {
            System.out.println("Selected course names for filtering: " + courseNames);

            filteredCombination = filteredCombination.stream()
                    .filter(course -> {
                        boolean matches = courseNames.stream()
                                .anyMatch(selectedCourseName -> selectedCourseName.trim().equalsIgnoreCase(course.getCourseName().trim()));

                        return matches;
                    })
                    .collect(Collectors.toList());

            System.out.println("After courseNames filter, course count: " + filteredCombination.size());
        }

        System.out.println("Before availableTimes filter, course count: " + filteredCombination.size());
        if (availableTimes != null && !availableTimes.isEmpty()) {
            System.out.println("Selected times for filtering: " + availableTimes);

            // 필터링 과정에서 각 강의를 대상으로 필터 적용 결과 출력
            filteredCombination = filteredCombination.stream()
                    .filter(course -> {
                        boolean isWithinTime = isTimeWithinSelectedTimes(course, availableTimes);
                        return isWithinTime;
                    })
                    .collect(Collectors.toList());
        }
        System.out.println("Before required courses filter, course count: " + filteredCombination.size());
        // 필수 강의 필터링
        List<Courses> requiredCoursesList = filteredCombination.stream()
                .filter(course -> requiredCourses.contains(course.getCourseName()))
                .collect(Collectors.toList());
        System.out.println("Required courses: " + requiredCourses);

        // 필수 강의가 조건에 맞지 않는 경우 빈 조합 반환
        if (requiredCoursesList.isEmpty()) {
            System.out.println("Required courses: " + requiredCourses);
            System.out.println("Filtered courses after previous conditions: " + filteredCombination.stream()
                    .map(Courses::getCourseName).toList());
            System.out.println("No required courses found in the filtered list");
            return combinations;
        }

        // 총 학점에 맞는 강의 조합 생성
        generateCombinations(filteredCombination, requiredCoursesList, totalCredits, new ArrayList<>(), combinations);

        // 생성된 조합을 강의명 리스트로 출력
        System.out.println("Generated combinations:");
        for (List<Courses> combination : combinations) {
            System.out.println(combination.stream().map(Courses::getCourseName).collect(Collectors.toList()));
        }

        return combinations;
    }

    private void generateCombinations(List<Courses> availableCourses, List<Courses> requiredCourses, Integer totalCredits,
                                      List<Courses> currentCombination, List<List<Courses>> allCombinations) {
        int currentCredits = currentCombination.stream().mapToInt(Courses::getCredit).sum();

        // 총 학점 조건을 만족하고 필수 강의가 모두 포함되었는지 검사
        boolean allRequiredCoursesIncluded = requiredCourses.stream().allMatch(currentCombination::contains);
        if (currentCredits <= totalCredits && allRequiredCoursesIncluded) {
            allCombinations.add(new ArrayList<>(currentCombination));

            // 생성된 조합이 너무 많으면 종료 (예: 100개로 제한)
            if (allCombinations.size() >= 100) {
                return;
            }
        }

        // 필수 강의가 아직 추가되지 않은 경우 추가
        for (Courses requiredCourse : requiredCourses) {
            if (!currentCombination.contains(requiredCourse)) {
                currentCombination.add(requiredCourse);
            }
        }

        // 남은 강의 중에서 조합 생성
        for (Courses course : availableCourses) {
            // 동일한 강의명(다른 교수명, 강의실 등)인 경우 한 조합에 포함되지 않도록 필터링
            boolean courseNameConflict = currentCombination.stream()
                    .anyMatch(existingCourse -> existingCourse.getCourseName().equalsIgnoreCase(course.getCourseName()));
            if (courseNameConflict) {
                continue;
            }

            // 현재 학점이 총 학점을 초과하면 더 이상 조합을 만들지 않음
            if (currentCredits + course.getCredit() > totalCredits) {
                continue;
            }

            currentCombination.add(course);
            generateCombinations(availableCourses, requiredCourses, totalCredits, currentCombination, allCombinations);
            currentCombination.remove(course);

            // 생성된 조합이 너무 많으면 종료 (예: 100개로 제한)
            if (allCombinations.size() >= 100) {
                return;
            }
        }
    }

}
