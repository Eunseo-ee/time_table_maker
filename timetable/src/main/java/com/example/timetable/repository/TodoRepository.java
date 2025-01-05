package com.example.timetable.repository;

import com.example.timetable.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId); // 특정 사용자의 할일 조회
    // ID를 기반으로 링크 필드를 null로 업데이트
    @Modifying
    @Query("UPDATE Todo t SET t.link = NULL WHERE t.id = :id")
    void clearLinkById(@Param("id") Long id);
}

