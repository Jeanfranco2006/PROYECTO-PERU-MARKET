// UsuarioService.java
package com.perumarket.erp.service;

import com.perumarket.erp.models.entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private com.perumarket.erp.repository.UsuarioRepository usuarioRepository;

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public Optional<Usuario> findActiveUserByUsername(String username) {
        return usuarioRepository.findByUsernameAndEstado(username, "ACTIVO");
    }

    public Optional<Usuario> findActiveUserWithDetails(String username) {
        return usuarioRepository.findActiveUserWithDetails(username);
    }
}