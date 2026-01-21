package com.duolingo.demo.repository;

import com.duolingo.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Para el Login: Buscar por nombre de usuario
    Optional<User> findByUsername(String username);

    // Para el Registro: Verificar duplicados
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}