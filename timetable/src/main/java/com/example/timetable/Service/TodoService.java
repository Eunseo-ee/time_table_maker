package com.example.timetable.Service;

import com.example.timetable.model.Todo;
import com.example.timetable.repository.TodoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    // 할일 추가
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    // 특정 사용자 할일 조회
    public List<Todo> getTodosByUserId(Long userId) {
        return todoRepository.findByUserId(userId)
                .stream()
                .peek(todo -> {
                    if (todo.getStatus() == null) {
                        todo.setStatus(Todo.Status.NO); // 기본 값 설정
                    }
                })
                .collect(Collectors.toList());
    }

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // 할일 업데이트
    public Todo updateTodoStatus(Long id, Todo.Status status) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("할일을 찾을 수 없습니다."));
        todo.setStatus(status);
        return todoRepository.save(todo);
    }

    public void updateStatus(Long id, String status) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));
        todo.setStatus(Todo.Status.valueOf(status.toUpperCase())); // Enum 변환
        todoRepository.save(todo);
    }

    // 할 일 수정
    public Todo updateTodo(Long id, Todo updatedTodo) {
        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setTaskName(updatedTodo.getTaskName());
                    existingTodo.setStatus(updatedTodo.getStatus());
                    existingTodo.setDueDate(updatedTodo.getDueDate());
                    return todoRepository.save(existingTodo);
                }).orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    // 할 일 삭제
    public void deleteTodoById(Long id) {
        todoRepository.deleteById(id);
    }

    public void updateTodoLink(Long id, String link) {
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new RuntimeException("할일을 찾을 수 없습니다."));
        todo.setLink(link);
        todoRepository.save(todo);
    }
}
