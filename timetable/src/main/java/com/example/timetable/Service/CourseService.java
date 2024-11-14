package com.example.timetable.Service;

import com.example.timetable.model.Courses;
import com.example.timetable.repository.CourseRepository;
import com.example.timetable.repository.DepartmentRepository;
import com.example.timetable.model.Departments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.*;
import java.util.stream.Collectors;  // Collectors 클래스 import
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;
import java.util.stream.Collectors;


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
        return isTimeWithinSelectedTimes(course, selectedTimes, new HashSet<>());
    }

    // 오버로드된 메서드로 방문한 강의를 추적하기 위해 추가된 매개변수
    private boolean isTimeWithinSelectedTimes(Courses course, List<String> selectedTimes, Set<Courses> visitedCourses) {
        if (visitedCourses.contains(course)) {
            return true; // 이미 방문한 강의라면 중복 검사를 피합니다.
        }

        visitedCourses.add(course); // 현재 강의를 방문한 것으로 표시

        String[] courseTimeSlots = course.getFormattedTime().split(", ");
        System.out.println("Checking times for course: " + course.getCourseName());

        // 각 강의 시간대에 대해 선택된 시간대와 비교
        for (String timeSlot : courseTimeSlots) {
            System.out.println("Course time slot being checked: " + timeSlot);
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

            System.out.println("Parsed Course Day: " + courseDay + ", Period Range: " + coursePeriodRange[0] + " - " + coursePeriodRange[1]);

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

                System.out.println("Parsed Selected Day: " + selectedDay + ", Period Range: " + selectedPeriodRange[0] + " - " + selectedPeriodRange[1]);
            }

            if (!matchFound) {
                System.out.println("No matching selected time found for time slot: " + timeSlot);
                return false; // 현재 강의 시간대에 대해 일치하는 선택된 시간대가 하나도 없는 경우 false 반환
            }
        }

        // 모든 강의 시간대가 선택된 시간대와 일치하는 경우, 동일 강의명, 교수명, 강의실을 가진 다른 시간대와도 합쳐서 처리
        List<Courses> relatedCourses = getRelatedCourses(course);

        // 연관된 모든 강의가 일치해야만 true를 반환하도록 수정
        for (Courses relatedCourse : relatedCourses) {
            if (!isTimeWithinSelectedTimes(relatedCourse, selectedTimes, visitedCourses)) {
                System.out.println("Related course does not match the selected times: " + relatedCourse.getCourseName());
                return false; // 직전/직후 강의 중 하나라도 선택된 시간과 맞지 않는 경우 false 반환
            }
        }

        // 모든 조건이 만족되는 경우 true 반환
        return true;
    }

    // 필터링된 조합 찾기 메서드
    public List<List<Courses>> findFilteredCombinations(
            int department_id, List<String> courseNames, Integer totalCredits, List<String> availableTimes, List<String> requiredCourses) {

        List<Courses> filteredCombination = getAllCourses();
        List<List<Courses>> combinations = new ArrayList<>();

        if (department_id != 0) {
            System.out.println(department_id);
            filteredCombination = filteredCombination.stream()
                    .filter(course -> course.getDepartmentId().equals(department_id))
                    .collect(Collectors.toList());
        }

        // 추가된 로그: 모든 강의 시간대 출력
        filteredCombination.forEach(course -> System.out.println("Course: " + course.getCourseName() + ", Formatted Time: " + course.getFormattedTime()));

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

        // 중복된 강의들을 합치지 않고 그대로 전달
        List<Courses> availableCourses = new ArrayList<>(filteredCombination);

        // 기존의 generateCombinations 호출
        generateCombinations(availableCourses, requiredCoursesList, totalCredits, new ArrayList<>(), combinations);

        // 모든 조합에 대해 로그 출력
        System.out.println("Generated combinations:");
        for (List<Courses> combination : combinations) {
            System.out.println("Combination:");
            for (Courses course : combination) {
                System.out.println("Course: " + course.getCourseName() + " (" + course.getProfessorName() + ")");
            }
            System.out.println("----");
        }

        return combinations;
    }

    // 직전/직후 강의를 찾는 메서드 (같은 강의명, 교수명, 강의실)
    private List<Courses> getRelatedCourses(Courses course) {
        return courseRepository.findByCourseNameAndProfessorNameAndClassroom(
                        course.getCourseName(),
                        course.getProfessorName(),
                        course.getClassroom()
                ).stream()
                .filter(c -> !c.equals(course)) // 현재 강의 제외
                .collect(Collectors.toList());
    }


    private void generateCombinations(List<Courses> availableCourses, List<Courses> requiredCourses, Integer totalCredits,
                                      List<Courses> currentCombination, List<List<Courses>> allCombinations) {
        int currentCredits = currentCombination.stream().mapToInt(Courses::getCredit).sum();

        // 총 학점 조건을 만족하고 필수 강의가 모두 포함되었는지 검사
        boolean allRequiredCoursesIncluded = requiredCourses.stream().allMatch(currentCombination::contains);

        if (currentCredits <= totalCredits && allRequiredCoursesIncluded) {
            // 중복 방지: 현재 조합이 이미 생성된 조합에 포함되어 있는지 검사
            if (!isDuplicateCombination(currentCombination, allCombinations)) {
                allCombinations.add(new ArrayList<>(currentCombination));
            }

            // 생성된 조합이 너무 많으면 종료 (예: 100개로 제한)
            if (allCombinations.size() >= 100) {
                return;
            }
        }

        for (Courses course : availableCourses) {
            if (currentCombination.contains(course)) {
                continue; // 이미 현재 조합에 포함된 경우 건너뜀
            }

            // 동일한 강의명, 교수명, 강의실을 가진 관련 강의들을 찾기
            List<Courses> relatedCourses = getRelatedCourses(course);

            // 현재 조합에 동일한 강의명을 가지면서 교수명이 다른 강의가 있는지 검사
            boolean sameCourseNameDifferentProfessorExists = currentCombination.stream()
                    .anyMatch(existingCourse -> existingCourse.getCourseName().equals(course.getCourseName()) &&
                            !existingCourse.getProfessorName().equals(course.getProfessorName()));
            if (sameCourseNameDifferentProfessorExists) {
                continue; // 동일한 강의명이면서 교수명이 다른 경우 추가하지 않음
            }

            // 모든 관련 강의를 추가하기 전에 시간 겹침 검사 수행
            boolean allTimesCompatible = currentCombination.stream()
                    .allMatch(existingCourse -> isTimeCompatible(existingCourse, course));

            if (!allTimesCompatible) {
                continue; // 만약 시간대가 겹치는 경우 해당 강의를 추가하지 않음
            }

            // 강의 추가 (관련 강의가 있는 경우 함께 추가)
            currentCombination.add(course);
            if (!relatedCourses.isEmpty()) {
                // 관련 강의도 함께 추가
                boolean relatedTimesCompatible = currentCombination.stream()
                        .allMatch(existingCourse -> relatedCourses.stream()
                                .allMatch(relatedCourse -> isTimeCompatible(existingCourse, relatedCourse)));

                if (relatedTimesCompatible) {
                    currentCombination.addAll(relatedCourses);
                }
            }

            int newCurrentCredits = currentCombination.stream().mapToInt(Courses::getCredit).sum();

            // 학점 초과 검사
            if (newCurrentCredits <= totalCredits) {
                generateCombinations(availableCourses, requiredCourses, totalCredits, currentCombination, allCombinations);
            }

            // 강의 제거 (백트래킹)
            currentCombination.remove(course);
            if (!relatedCourses.isEmpty()) {
                // 관련 강의도 함께 제거
                currentCombination.removeAll(relatedCourses);
            }
        }
    }


    // 중복된 조합을 확인하는 메서드
    private boolean isDuplicateCombination(List<Courses> combination, List<List<Courses>> allCombinations) {
        for (List<Courses> existingCombination : allCombinations) {
            if (existingCombination.size() == combination.size() &&
                    existingCombination.containsAll(combination) &&
                    combination.containsAll(existingCombination)) {
                return true; // 중복된 조합이 존재
            }
        }
        return false; // 중복되지 않음
    }

    // 두 강의의 시간이 겹치는지 확인하는 메서드
    private boolean isTimeCompatible(Courses course1, Courses course2) {
        String[] timeSlots1 = course1.getFormattedTime().split(", ");
        String[] timeSlots2 = course2.getFormattedTime().split(", ");

        for (String timeSlot1 : timeSlots1) {
            String[] split1 = timeSlot1.split(" ");
            if (split1.length < 2) {
                continue;
            }
            String day1 = split1[0];
            String[] periodRange1 = split1[1].split("-");
            if (periodRange1.length < 2) {
                continue;
            }
            float start1 = Float.parseFloat(periodRange1[0]);
            float end1 = Float.parseFloat(periodRange1[1]);

            for (String timeSlot2 : timeSlots2) {
                String[] split2 = timeSlot2.split(" ");
                if (split2.length < 2) {
                    continue;
                }
                String day2 = split2[0];
                String[] periodRange2 = split2[1].split("-");
                if (periodRange2.length < 2) {
                    continue;
                }
                float start2 = Float.parseFloat(periodRange2[0]);
                float end2 = Float.parseFloat(periodRange2[1]);

                if (day1.equals(day2) && ((start1 <= end2 && start1 >= start2) || (start2 <= end1 && start2 >= start1))) {
                    return false; // 시간이 겹치는 경우 호환되지 않음
                }
            }
        }

        return true; // 시간이 겹치지 않는 경우 호환됨
    }
}
