package com.duolingo.demo.service;

import com.duolingo.demo.dto.ExerciseDto;
import com.duolingo.demo.model.Exercise;
import com.duolingo.demo.model.Round;
import com.duolingo.demo.model.TipoEjercicio;
import com.duolingo.demo.repository.ExerciseRepository;
import com.duolingo.demo.repository.RoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private RoundRepository roundRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Exercise crearEjercicio(ExerciseDto dto, MultipartFile imagen, MultipartFile audio) {
        Round ronda = roundRepository.findById(dto.getRondaId())
                .orElseThrow(() -> new RuntimeException("Ronda no encontrada"));

        Exercise ex = new Exercise();
        ex.setEnunciado(dto.getEnunciado());
        ex.setRespuestaCorrecta(dto.getRespuestaCorrecta());
        ex.setTipo(TipoEjercicio.valueOf(dto.getTipo()));
        ex.setOpcionesIncorrectas(dto.getOpcionesIncorrectas());
        ex.setRonda(ronda);

        // Guardar archivos si existen
        if (imagen != null && !imagen.isEmpty()) {
            String rutaImagen = fileStorageService.store(imagen);
            ex.setImagenUrl(rutaImagen);
        }

        if (audio != null && !audio.isEmpty()) {
            String rutaAudio = fileStorageService.store(audio);
            ex.setAudioUrl(rutaAudio);
        }

        return exerciseRepository.save(ex);
    }

    public List<Exercise> obtenerEjerciciosDeRonda(Long rondaId) {
        return exerciseRepository.findByRondaId(rondaId);
    }
}