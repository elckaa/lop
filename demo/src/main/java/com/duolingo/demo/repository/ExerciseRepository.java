package com.duolingo.demo.repository;

import com.duolingo.demo.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByRondaId(Long rondaId);

    // ✅ CONTADOR (CLAVE)
    int countByRondaId(Long rondaId);
}
