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

    @Column(name = "courseCode")
    private Integer courseCode;

    @Column(name = "courseName")
    private String courseName;

    @Column(name = "courseNumber")
    private Integer courseNumber;

    @Column(name = "division")
    private String division;

    @Column(name = "credit")
    private Integer credit;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "professorName")
    private String professorName;

    @Column(name = "classroom")
    private String classroom;

    @Column(name = "day_of_week")
    private String dayOfWeek;

    @Column(name = "start_period")
    private Float start_period;

    @Column(name = "end_period")
    private Float end_period;

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
