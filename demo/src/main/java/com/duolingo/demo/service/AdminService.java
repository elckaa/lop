package com.duolingo.demo.service;

import com.duolingo.demo.dto.UserDto;
import com.duolingo.demo.model.Role;
import com.duolingo.demo.model.User;
import com.duolingo.demo.repository.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- 1. LISTAR USUARIOS (Filtrar por Rol) ---
    public List<UserDto> obtenerUsuariosPorRol(Role role) {
        // Buscamos todos y filtramos en memoria (o podrías crear un método en Repository)
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == role)
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // --- 2. CREAR USUARIO MANUALMENTE ---
    public User crearUsuarioManual(UserDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Error: El usuario ya existe");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        // Contraseña por defecto si no viene: "123456" (Deberían cambiarla luego)
        String pass = (dto.getPassword() != null && !dto.getPassword().isEmpty()) ? dto.getPassword() : "123456";
        user.setPassword(passwordEncoder.encode(pass));
        user.setRole(Role.valueOf(dto.getRole())); // "DOCENTE" o "ESTUDIANTE"
        user.setEnabled(true);

        return userRepository.save(user);
    }

    // --- 3. EDITAR USUARIO ---
    public User actualizarUsuario(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());

        // --- LA LÍNEA MÁGICA QUE FALTABA ---
        if (dto.getRole() != null) {
            user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
        }

        // Solo actualizamos password si envían una nueva
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return userRepository.save(user);
    }

    // --- 4. ELIMINAR USUARIO ---
    public void eliminarUsuario(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        userRepository.deleteById(id);
    }

    // --- MÉTODO EXISTENTE (PDF) ---
    public void registrarAlumnosDesdePdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String texto = stripper.getText(document);
            String[] lineas = texto.split("\\r?\\n");

            for (String linea : lineas) {
                String[] datos = linea.trim().split("\\s+");
                if (datos.length >= 3) {
                    if (!userRepository.existsByUsername(datos[0])) {
                        User u = new User();
                        u.setUsername(datos[0]);
                        u.setEmail(datos[1]);
                        u.setPassword(passwordEncoder.encode(datos[2]));
                        u.setRole(Role.ESTUDIANTE);
                        userRepository.save(u);
                    }
                }
            }
        }
    }

    // Helper para convertir Entity a DTO
    private UserDto convertirADto(User u) {
        return UserDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .role(u.getRole().name())
                .build();
    }
}