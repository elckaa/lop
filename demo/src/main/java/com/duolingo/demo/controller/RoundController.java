package com.duolingo.demo.controller;

import com.duolingo.demo.dto.RoundDto;
import com.duolingo.demo.model.Round;
import com.duolingo.demo.model.User;
import com.duolingo.demo.repository.UserRepository;
import com.duolingo.demo.service.RoundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rounds")
public class RoundController {

    @Autowired
    private RoundService roundService;

    @Autowired
    private UserRepository userRepository;

    // =====================================================
    // OBTENER RONDAS (CORREGIDO)
    // =====================================================
    @GetMapping
    @PreAuthorize("hasAnyAuthority('DOCENTE', 'ADMIN')")
    public ResponseEntity<List<RoundDto>> getMyRounds(Authentication authentication) {

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Round> rondas = user.getRole().name().equals("ADMIN")
                ? roundService.listarTodas()
                : roundService.listarPorDocente(user.getId());

        List<RoundDto> response = rondas.stream()
                .map(r -> RoundDto.builder()
                        .id(r.getId())
                        .titulo(r.getTitulo())
                        .descripcion(r.getDescripcion())
                        .nivel(r.getNivel())
                        // --- ¡AQUÍ FALTABA ESTO! ---
                        .activo(r.isActivo()) // <--- IMPORTANTE: Pasar el estado
                        .creadorId(r.getCreador() != null ? r.getCreador().getId() : null)
                        .creadorNombre(r.getCreador() != null ? r.getCreador().getUsername() : "—")
                        .cantidadEjercicios(r.getEjercicios() != null ? r.getEjercicios().size() : 0)
                        .build()
                )
                .toList();

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // OBTENER UNA (CORREGIDO)
    // =====================================================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('DOCENTE', 'ADMIN')")
    public ResponseEntity<RoundDto> getOne(@PathVariable Long id) {

        Round r = roundService.obtenerPorId(id);

        RoundDto dto = RoundDto.builder()
                .id(r.getId())
                .titulo(r.getTitulo())
                .descripcion(r.getDescripcion())
                .nivel(r.getNivel())
                // --- AQUÍ TAMBIÉN FALTABA ---
                .activo(r.isActivo())
                .creadorId(r.getCreador() != null ? r.getCreador().getId() : null)
                .creadorNombre(r.getCreador() != null ? r.getCreador().getUsername() : "—")
                .cantidadEjercicios(r.getEjercicios() != null ? r.getEjercicios().size() : 0)
                .build();

        return ResponseEntity.ok(dto);
    }

    // =====================================================
    // CREAR
    // =====================================================
    @PostMapping
    @PreAuthorize("hasAuthority('DOCENTE')")
    public ResponseEntity<Round> create(@RequestBody Round round, Authentication authentication) {
        User docente = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        return ResponseEntity.ok(roundService.guardarRonda(round, docente));
    }

    // =====================================================
    // EDITAR
    // =====================================================
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('DOCENTE')")
    public ResponseEntity<Round> update(@PathVariable Long id, @RequestBody Round round) {
        return ResponseEntity.ok(roundService.actualizarRonda(id, round));
    }

    // =====================================================
    // ACTIVAR / DESACTIVAR
    // =====================================================
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAuthority('DOCENTE')")
    public ResponseEntity<Void> toggle(@PathVariable Long id) {
        roundService.toggleEstado(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DOCENTE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roundService.eliminarRonda(id);
        return ResponseEntity.ok().build();
    }
}