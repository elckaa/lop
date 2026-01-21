package com.duolingo.demo.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    // Carpeta donde se guardarán los archivos
    private final Path rootLocation = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar la carpeta de uploads", e);
        }
    }

    // 1. GUARDAR ARCHIVO (Ya lo tenías)
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Error: Archivo vacío.");
            }
            // Generamos nombre único para no sobreescribir (ej: gato.png -> uuid-gato.png)
            String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

            // Retornamos la ruta relativa para guardarla en la BD
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Fallo al guardar el archivo " + file.getOriginalFilename(), e);
        }
    }

    // 2. LEER ARCHIVO (ESTE ES EL QUE TE FALTABA)
    public Resource load(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("No se puede leer el archivo: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}