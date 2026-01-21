package com.duolingo.demo.service;

import com.duolingo.demo.model.Progress;
import com.duolingo.demo.model.Round;
import com.duolingo.demo.model.User;
import com.duolingo.demo.repository.ProgressRepository;
import com.duolingo.demo.repository.RoundRepository;
import com.duolingo.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime; // <--- Importante para actualizar fecha
import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoundRepository roundRepository;

    public Progress guardarProgreso(Long estudianteId, Long rondaId, Integer puntaje) {

        // 1. Verificamos que existan Usuario y Ronda
        User estudiante = userRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        Round ronda = roundRepository.findById(rondaId)
                .orElseThrow(() -> new RuntimeException("Ronda no encontrada"));

        // 2. BUSCAR SI YA EXISTE UN REGISTRO PREVIO
        Optional<Progress> existente = progressRepository.findByEstudianteIdAndRondaId(estudianteId, rondaId);

        if (existente.isPresent()) {
            // --- ACTUALIZAR EXISTENTE ---
            Progress progreso = existente.get();
            progreso.setPuntaje(puntaje); // Sobreescribimos la nota (o podrías usar Math.max para dejar la mejor)
            progreso.setFechaRealizacion(LocalDateTime.now()); // Actualizamos la fecha
            return progressRepository.save(progreso);
        } else {
            // --- CREAR NUEVO ---
            Progress nuevoProgreso = Progress.builder()
                    .estudiante(estudiante)
                    .ronda(ronda)
                    .puntaje(puntaje)
                    // La fecha se pone sola gracias al @PrePersist en el modelo,
                    // o puedes ponerla aquí explícitamente:
                    .fechaRealizacion(LocalDateTime.now())
                    .build();
            return progressRepository.save(nuevoProgreso);
        }
    }

    public List<Progress> historialEstudiante(Long estudianteId) {
        return progressRepository.findByEstudianteId(estudianteId);
    }
}