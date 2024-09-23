package com.example.TimeTable.model;

import lombok.Getter;

import javax.persistence.*;

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

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
