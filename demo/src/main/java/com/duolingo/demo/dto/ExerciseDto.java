package com.duolingo.demo.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ExerciseDto {
    private Long id;
    private String enunciado;
    private String respuestaCorrecta;
    private String tipo; // IMAGEN, AUDIO, TRADUCCION, etc.

    // Lista de distractores (para selección múltiple)
    private List<String> opcionesIncorrectas;

    // URLs para que el frontend pueda cargar los archivos
    private String imagenUrl;
    private String audioUrl;

    private Long rondaId;
}