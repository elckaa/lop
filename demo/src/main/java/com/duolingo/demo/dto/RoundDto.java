package com.duolingo.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoundDto {
    private Long id;
    private String titulo;
    private String descripcion;
    private String nivel;
    private boolean activo;
    private Long creadorId; // El ID del docente
    private String creadorNombre; // El nombre del docente (útil para mostrar)
    private int cantidadEjercicios; // Dato calculado
}