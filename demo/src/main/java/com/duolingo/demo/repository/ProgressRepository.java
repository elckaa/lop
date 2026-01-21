package com.duolingo.demo.repository;

import com.duolingo.demo.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    // Ver todo el historial de un estudiante específico
    List<Progress> findByEstudianteId(Long estudianteId);

    // Ver si un estudiante ya completó una ronda específica (para no dejarle repetirla si no quieres)
    // O para actualizar su nota anterior
    Optional<Progress> findByEstudianteIdAndRondaId(Long estudianteId, Long rondaId);
}