package com.example.timetable.model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
@Setter
@Getter
public class Courses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_id")
    private Integer department_id;

    @Column(name = "course_code")
    private Integer courseCode;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "course_number")
    private Integer courseNumber;

    @Column(name = "division")
    private String division;

    @Column(name = "credit")
    private Integer credit;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "professor_name")
    private String professorName;

    @Column(name = "classroom")
    private String classroom;

    @Column(name = "day_of_week")
    private String dayOfWeek;

    @Column(name = "start_period")
    private Float start_period;

    @Column(name = "end_period")
    private Float end_period;

    @Transient
    private String departmentName;

    public String getDepartmentName() {
        if (department_id != null) {
            return switch (department_id) {
                case 1 -> "기계시스템디자인공학과";
                case 2 -> "기계자동차공학과";
                case 3 -> "안전공학과";
                case 4 -> "신소재공학과";
                case 5 -> "건설시스템공학과";
                case 6 -> "건축공학전공";
                case 7 -> "건축학전공";
                case 8 -> "반도체융합공학전공";
                case 9 -> "전기정보공학과";
                case 10 -> "컴퓨터공학과";
                case 11 -> "스마트ICT융합공학과";
                case 12 -> "전자공학과";
                case 13 -> "IT융합소프트웨어전공";
                case 14 -> "화공생명공학과";
                case 15 -> "환경공학과";
                case 16 -> "식품생명공학과";
                case 17 -> "정밀화학과";
                case 18 -> "스포츠과학과";
                case 19 -> "안경광학과";
                case 20 -> "시각디자인전공";
                case 21 -> "산업디자인전공";
                case 22 -> "도예학과";
                case 23 -> "금속공예디자인학과";
                case 24 -> "조형예술학과";
                case 25 -> "영어영문학과";
                case 26 -> "행정학과";
                case 27 -> "문예창작학과";
                case 28 -> "한국문화전공";
                case 29 -> "산업정보시스템전공";
                case 30 -> "ITM전공";
                case 31 -> "경영학전공";
                case 32 -> "글로벌테크노경영전공";
                case 33 -> "MSDE학과";
                case 34 -> "빅데이터경영공학전공";
                case 35 -> "창업융합전공";
                case 36 -> "지식재산기술경영전공";
                case 37 -> "융합기계공학과";
                case 38 -> "헬스피트니스학과";
                case 39 -> "건설환경융합공학과";
                case 40 -> "문화예술학과";
                case 41 -> "영어과";
                case 42 -> "벤처경영학과";
                case 43 -> "정보통신융합공학과";
                case 44 -> "미래에너지융합학과";
                case 45 -> "지능형반도체공학과";
                case 46 -> "인공지능응용학과";
                case 47 -> "창업교육센터";
                case 48 -> "국제교류처";
                case 49 -> "교양대학";
                case 50 -> "글로벌기초교육학부";
                case 51 -> "글로벌한국어문화학부";
                case 52 -> "미래융합대학";
                case 53 -> "조형대학";
                default -> "기타";
            };
        }
        return "정보 없음";
    }

    @Setter
    @Transient
    private String formattedTime;


    // 기본 생성자
    public Courses() {}

    // 생성자, Getter 및 Setter 메소드
    public Courses(int department_id, Integer courseCode, String courseName, Integer courseNumber,
                   String division, Integer credit, Integer capacity, String professorName, String classroom,
                   String dayOfWeek,Float start_period,Float end_period) {
        this.department_id = department_id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.courseNumber = courseNumber;
        this.division = division;
        this.credit = credit;
        this.capacity = capacity;
        this.professorName = professorName;
        this.classroom = classroom;
        this.dayOfWeek = dayOfWeek;
        this.start_period = start_period;
        this.end_period = end_period;
    }

    public String getFormattedTime() {
        return dayOfWeek + " " + start_period + (end_period != start_period ? "-" + end_period : "");
    }

    public Integer getDepartmentId() {
        return department_id;
    }
    public void setDepartmentId(Integer departmentId) {
        this.department_id = departmentId;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }
    public void setDayOfWeek(String day_of_week) {
        this.dayOfWeek = dayOfWeek;
    }

    public float getStartPeriod() {
        return start_period;
    }
    public void setStartPeriod(float startPeriod) {
        this.start_period = startPeriod;
    }

    public float getEndPeriod() {
        return end_period;
    }
    public void setEndPeriod(float endPeriod) {
        this.end_period = endPeriod;
    }
}
