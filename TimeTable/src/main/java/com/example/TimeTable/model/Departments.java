package com.example.timetable.model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Setter
@Getter
@Entity
@Table(name = "departments")
public class Departments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String code;

    // 기본 생성자
    public Departments() {}

    // 생성자, Getter 및 Setter 메소드
    public Departments(String name, String code) {
        this.name = name;
        this.code = code;
    }

}
