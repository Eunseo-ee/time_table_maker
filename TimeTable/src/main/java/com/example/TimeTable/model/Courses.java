package com.example.TimeTable.model;

import javax.persistence.*;

@Entity
@Table(name = "courses")
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

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDepartmentId() {
        return department_id;
    }
    public void setDepartmentId(Integer departmentId) {
        this.department_id = departmentId;
    }

    public Integer getCourseCode() {
        return courseCode;
    }
    public void setCourseCode(Integer courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getCourseNumber() {
        return courseNumber;
    }
    public void setCourseNumber(Integer courseNumber) {
        this.courseNumber = courseNumber;
    }

    public String getDivision() {
        return division;
    }
    public void setDivision(String division) {
        this.division = division;
    }

    public Integer getCredit() {
        return credit;
    }
    public void setCredit(Integer credit) {
        this.credit = credit;
    }

    public Integer getCapacity() {
        return capacity;
    }
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getProfessorName() {
        return professorName;
    }
    public void setProfessorName(String professorName) {
        this.professorName = professorName;
    }

    public String getClassroom() {
        return classroom;
    }
    public void setClassroom(String classroom) {
        this.classroom = classroom;
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
