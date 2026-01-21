package com.duolingo.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "rondas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descripcion;
    private String nivel;
    private boolean activo = true;

    // IMPORTANTE: Si User está en el mismo package, no necesita import,
    // pero si está en otro (ej: com.duolingo.demo.model.User), asegúrate que exista.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creador_id")
    @JsonIgnore
    private User creador;

    @OneToMany(mappedBy = "ronda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> ejercicios;

    // Getters y Setters manuales (por si Lombok no está cargando bien en tu PC)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }
    public User getCreador() { return creador; }
    public void setCreador(User creador) { this.creador = creador; }
    public List<Exercise> getEjercicios() { return ejercicios; }
    public void setEjercicios(List<Exercise> ejercicios) { this.ejercicios = ejercicios; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}