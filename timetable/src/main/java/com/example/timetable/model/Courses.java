package com.example.timetable.model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Courses {

    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_id")
    private Integer department_id;
    @Setter
    @Getter
    @Column(name = "courseCode")
    private Integer courseCode;
    @Setter
    @Getter
    @Column(name = "courseName")
    private String courseName;
    @Setter
    @Getter
    @Column(name = "courseNumber")
    private Integer courseNumber;
    @Getter
    @Setter
    @Column(name = "division")
    private String division;
    @Getter
    @Setter
    @Column(name = "credit")
    private Integer credit;
    @Getter
    @Setter
    @Column(name = "capacity")
    private Integer capacity;
    @Getter
    @Setter
    @Column(name = "professorName")
    private String professorName;
    @Setter
    @Getter
    @Column(name = "classroom")
    private String classroom;
    @Column(name = "day_of_week")
    private String day_of_week;
    @Column(name = "start_period")
    private Float start_period;
    @Column(name = "end_period")
    private Float end_period;

    // 기본 생성자
    public Courses() {}

    // 생성자, Getter 및 Setter 메소드
    public Courses(int department_id, Integer courseCode, String courseName, Integer courseNumber,
                   String division, Integer credit, Integer capacity, String professorName, String classroom,
                   String day_of_week,Float start_period,Float end_period) {
        this.department_id = department_id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.courseNumber = courseNumber;
        this.division = division;
        this.credit = credit;
        this.capacity = capacity;
        this.professorName = professorName;
        this.classroom = classroom;
        this.day_of_week = day_of_week;
        this.start_period = start_period;
        this.end_period = end_period;
    }

    public Integer getDepartmentId() {
        return department_id;
    }
    public void setDepartmentId(Integer departmentId) {
        this.department_id = departmentId;
    }

    public String getDayOfWeek() {
        return day_of_week;
    }
    public void setDayOfWeek(String day_of_week) {
        this.day_of_week = day_of_week;
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
