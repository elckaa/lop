package com.duolingo.demo.repository;

import com.duolingo.demo.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoundRepository extends JpaRepository<Round, Long> {

    // Para que el Docente vea SOLO las rondas que él creó
    List<Round> findByCreadorId(Long creadorId);

    // (Opcional) Si quisieras buscar por nivel, ej: "Dame todas las de A1"
    List<Round> findByNivel(String nivel);
}