// AuthService.java
package com.perumarket.erp.service;

import com.perumarket.erp.models.dto.*;
import com.perumarket.erp.models.entity.*;
import com.perumarket.erp.repository.UsuarioRepository;
import com.perumarket.erp.repository.RoleModulePermissionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleModulePermissionsRepository permissionsRepository;

    public LoginResponse login(LoginRequest request) {
        try {
            System.out.println("🔐 Intentando login para usuario: " + request.getUsername());

            // Buscar usuario activo con detalles - usar el método correcto
            Usuario usuario = usuarioRepository.findActiveUserWithDetails(request.getUsername())
                    .orElse(null);

            if (usuario == null) {
                System.out.println("❌ Usuario no encontrado o inactivo: " + request.getUsername());
                return new LoginResponse(false, "Usuario o contraseña incorrectos");
            }

            // Verificar contraseña (en producción usar BCrypt)
            if (!usuario.getPassword().equals(request.getPassword())) {
                System.out.println("❌ Contraseña incorrecta para: " + request.getUsername());
                return new LoginResponse(false, "Usuario o contraseña incorrectos");
            }

            // Obtener módulos accesibles
            List<ModuleInfo> modules = getAccessibleModules(usuario.getRol().getId());

            // Construir UserInfo
            UserInfo userInfo = new UserInfo(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getPersona().getNombres(),
                usuario.getPersona().getApellidoPaterno() + " " + usuario.getPersona().getApellidoMaterno(),
                usuario.getRol().getNombre(),
                usuario.getPersona().getCorreo()
            );

            // Generar token simple (en producción usar JWT)
            String token = generateSimpleToken(usuario);

            System.out.println("✅ Login exitoso para: " + request.getUsername());
            System.out.println("📋 Módulos asignados: " + modules.size());

            return new LoginResponse(true, "Login exitoso", token, userInfo, modules);

        } catch (Exception e) {
            System.err.println("❌ Error en servicio de autenticación: " + e.getMessage());
            e.printStackTrace();
            return new LoginResponse(false, "Error interno del servidor: " + e.getMessage());
        }
    }

    private List<ModuleInfo> getAccessibleModules(Long rolId) {
        List<RoleModulePermissions> permissions = permissionsRepository.findAccessibleModulesByRolId(rolId);
        
        return permissions.stream()
                .map(permission -> new ModuleInfo(
                    permission.getModulo().getId(),
                    permission.getModulo().getNombre(),
                    permission.getModulo().getDescripcion(),
                    permission.getModulo().getRuta()
                ))
                .collect(Collectors.toList());
    }

    private String generateSimpleToken(Usuario usuario) {
        // Token simple para desarrollo (en producción usar JWT)
        return "dev-token-" + usuario.getId() + "-" + System.currentTimeMillis();
    }
}