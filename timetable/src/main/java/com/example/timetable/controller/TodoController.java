package com.example.timetable.controller;

import com.example.timetable.Service.TodoService;
import com.example.timetable.model.Todo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")

@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:63342", "http://localhost:63343"})

public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // 할일 생성
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        // 기본값 설정
        if (todo.getStatus() == null) {
            todo.setStatus(Todo.Status.NO);
        }

        Todo createdTodo = todoService.createTodo(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    // 사용자별 할일 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Todo>> getTodosByUserId(@PathVariable Long userId) {
        List<Todo> todos = todoService.getTodosByUserId(userId);
        return ResponseEntity.ok(todos);
    }

    // 할일 상태 업데이트
    @PutMapping("/{id}/status")
    public ResponseEntity<Todo> updateTodoStatus(@PathVariable Long id, @RequestParam String status) {
        Todo.Status updatedStatus;
        try {
            updatedStatus = Todo.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        Todo updatedTodo = todoService.updateTodoStatus(id, updatedStatus);
        return ResponseEntity.ok(updatedTodo);
    }


    // 할일 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodoById(@PathVariable Long id) {
        todoService.deleteTodoById(id);
        return ResponseEntity.noContent().build();
    }
}
