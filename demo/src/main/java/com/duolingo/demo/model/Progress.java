package com.duolingo.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "progresos")
@Data // Genera getters, setters, toString, etc. automáticamente
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer puntaje;

    private LocalDateTime fechaRealizacion;

    // --- CORRECCIÓN 1: SOLUCIÓN AL ERROR DE SERIALIZACIÓN ---
    // Cambiamos a EAGER para que traiga los datos sí o sí.
    // Usamos JsonIgnoreProperties para evitar el error del "ByteBuddyInterceptor"
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estudiante_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "roles", "authorities"})
    private User estudiante;

    // --- CORRECCIÓN 2: LO MISMO PARA LA RONDA ---
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ronda_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "ejercicios"}) // Ignoramos ejercicios para no hacer el JSON gigante
    private Round ronda;

    // Método para guardar la fecha automáticamente
    @PrePersist
    public void prePersist() {
        this.fechaRealizacion = LocalDateTime.now();
    }

    // ¡YA NO NECESITAS LOS GETTERS Y SETTERS MANUALES!
    // @Data YA LO HIZO POR TI.
}