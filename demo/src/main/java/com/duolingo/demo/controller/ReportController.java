package com.duolingo.demo.controller;

import com.duolingo.demo.model.Progress;
import com.duolingo.demo.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports") // <--- ZONA NEUTRAL (No dice 'admin')
public class ReportController {

    @Autowired
    private ProgressRepository progressRepository;

    @PreAuthorize("hasAnyAuthority('ADMIN', 'DOCENTE')")
    @GetMapping("/global") // URL Final: /api/reports/global
    public ResponseEntity<List<Progress>> obtenerReporteGlobal() {
        return ResponseEntity.ok(progressRepository.findAll());
    }
}