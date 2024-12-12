package com.example.timetable.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = true) // NULL 허용
    private Long userId;

    @Column(name = "subject_name", nullable = false, length = 255)
    private String subjectName;

    @Column(name = "task_name", nullable = false, length = 255)
    private String taskName;

    @Column(name = "due_date", nullable = true) // NULL 허용
    private LocalDate dueDate;

    @Column(name = "task_date", nullable = false)
    private LocalDate taskDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "ENUM('CLEAR', 'NO', 'NOTDONE', 'EMPTY') DEFAULT 'EMPTY'")
    private Status status = Status.EMPTY; // 기본값

    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory = false; // 기본값

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum 정의
    public enum Status {
        NO("no"),
        CLEAR("clear"),
        NOTDONE("notdone"),
        EMPTY("empty");

        private final String value;

        Status(String value) {
            this.value = value;
        }

        @JsonCreator
        public static Status fromValue(String value) {
            for (Status status : Status.values()) {
                if (status.value.equalsIgnoreCase(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Invalid status: " + value);
        }

        @JsonValue
        public String getValue() {
            return value;
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

