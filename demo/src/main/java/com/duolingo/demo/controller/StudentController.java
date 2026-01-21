package com.duolingo.demo.controller;

import com.duolingo.demo.model.Exercise;
import com.duolingo.demo.model.Progress;
import com.duolingo.demo.model.Round;
import com.duolingo.demo.service.ExerciseService;
import com.duolingo.demo.service.ProgressService;
import com.duolingo.demo.service.RoundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasAuthority('ESTUDIANTE')")
public class StudentController {

    @Autowired
    private RoundService roundService;

    @Autowired
    private ExerciseService exerciseService;

    @Autowired
    private ProgressService progressService;

    // 1. Ver todas las lecciones disponibles (El mapa)
    @GetMapping("/rondas")
    public ResponseEntity<List<Round>> getAllRounds() {
        return ResponseEntity.ok(roundService.listarTodas());
    }

    // 2. Entrar a una ronda (Bajar los ejercicios para jugar)
    @GetMapping("/rondas/{rondaId}/ejercicios")
    public ResponseEntity<List<Exercise>> getExercisesForRound(@PathVariable Long rondaId) {
        return ResponseEntity.ok(exerciseService.obtenerEjerciciosDeRonda(rondaId));
    }

    // 3. Guardar mi nota final
    // URL: /api/student/progreso?estudianteId=1&rondaId=5&puntaje=100
    @PostMapping("/progreso")
    public ResponseEntity<Progress> saveProgress(
            @RequestParam Long estudianteId,
            @RequestParam Long rondaId,
            @RequestParam Integer puntaje) {

        return ResponseEntity.ok(progressService.guardarProgreso(estudianteId, rondaId, puntaje));
    }

    // 4. Ver mi historial (Para ver mis medallas)
    @GetMapping("/mi-historial/{estudianteId}")
    public ResponseEntity<List<Progress>> getMyHistory(@PathVariable Long estudianteId) {
        return ResponseEntity.ok(progressService.historialEstudiante(estudianteId));
    }
}