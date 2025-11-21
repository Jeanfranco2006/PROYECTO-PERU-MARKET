// AccesosController.java
package com.perumarket.erp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perumarket.erp.models.dto.CreateUsuarioRequest;
import com.perumarket.erp.models.dto.ModuloDTO;
import com.perumarket.erp.models.dto.RolDTO;
import com.perumarket.erp.models.dto.RolePermissionDTO;
import com.perumarket.erp.models.dto.UpdatePermissionsRequest;
import com.perumarket.erp.models.dto.UpdateUsuarioRequest;
import com.perumarket.erp.models.dto.UsuarioDTO;
import com.perumarket.erp.service.AccesosService;

@RestController
@RequestMapping("/accesos")
@CrossOrigin(origins = "http://localhost:5173")
public class AccesosController {

    @Autowired
    private AccesosService accesosService;

    // ========== ENDPOINTS USUARIOS ==========
    
    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        try {
            List<UsuarioDTO> usuarios = accesosService.getAllUsuarios();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable Long id) {
        try {
            UsuarioDTO usuario = accesosService.getUsuarioById(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/usuarios")
    public ResponseEntity<?> createUsuario(@RequestBody CreateUsuarioRequest request) {
        try {
            UsuarioDTO usuario = accesosService.createUsuario(request);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @RequestBody UpdateUsuarioRequest request) {
        try {
            UsuarioDTO usuario = accesosService.updateUsuario(id, request);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        try {
            accesosService.deleteUsuario(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    // ========== ENDPOINTS ROLES ==========
    
    @GetMapping("/roles")
    public ResponseEntity<List<RolDTO>> getAllRoles() {
        try {
            List<RolDTO> roles = accesosService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<RolDTO> getRolById(@PathVariable Long id) {
        try {
            RolDTO rol = accesosService.getRolById(id);
            return ResponseEntity.ok(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/roles")
    public ResponseEntity<?> createRol(@RequestBody RolDTO request) {
        try {
            RolDTO rol = accesosService.createRol(request);
            return ResponseEntity.ok(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @PutMapping("/roles/{id}")
    public ResponseEntity<?> updateRol(@PathVariable Long id, @RequestBody RolDTO request) {
        try {
            RolDTO rol = accesosService.updateRol(id, request);
            return ResponseEntity.ok(rol);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<?> deleteRol(@PathVariable Long id) {
        try {
            accesosService.deleteRol(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @GetMapping("/roles/dropdown")
    public ResponseEntity<List<RolDTO>> getRolesForDropdown() {
        try {
            List<RolDTO> roles = accesosService.getRolesForDropdown();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ========== ENDPOINTS MÓDULOS ==========
    
    @GetMapping("/modulos")
    public ResponseEntity<List<ModuloDTO>> getAllModulos() {
        try {
            List<ModuloDTO> modulos = accesosService.getAllModulos();
            return ResponseEntity.ok(modulos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/modulos/{id}")
    public ResponseEntity<ModuloDTO> getModuloById(@PathVariable Long id) {
        try {
            ModuloDTO modulo = accesosService.getModuloById(id);
            return ResponseEntity.ok(modulo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/modulos")
    public ResponseEntity<?> createModulo(@RequestBody ModuloDTO request) {
        try {
            ModuloDTO modulo = accesosService.createModulo(request);
            return ResponseEntity.ok(modulo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @PutMapping("/modulos/{id}")
    public ResponseEntity<?> updateModulo(@PathVariable Long id, @RequestBody ModuloDTO request) {
        try {
            ModuloDTO modulo = accesosService.updateModulo(id, request);
            return ResponseEntity.ok(modulo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    @DeleteMapping("/modulos/{id}")
    public ResponseEntity<?> deleteModulo(@PathVariable Long id) {
        try {
            accesosService.deleteModulo(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    // ========== ENDPOINTS PERMISOS ==========
    
    @GetMapping("/roles/{rolId}/permisos")
    public ResponseEntity<List<RolePermissionDTO>> getPermissionsByRol(@PathVariable Long rolId) {
        try {
            List<RolePermissionDTO> permisos = accesosService.getPermissionsByRol(rolId);
            return ResponseEntity.ok(permisos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/roles/permisos")
    public ResponseEntity<?> updatePermissions(@RequestBody UpdatePermissionsRequest request) {
        try {
            accesosService.updatePermissions(request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor");
        }
    }

    // En AccesosController.java - AGREGAR ESTE MÉTODO
@GetMapping("/test")
public ResponseEntity<String> testConnection() {
    try {
        System.out.println("✅ Endpoint /accesos/test llamado exitosamente");
        
        // Verificar conexión a repositorios
        long usuariosCount = 0;
        long rolesCount = 0;
        long modulosCount = 0;
        
        try {
            usuariosCount = accesosService.getAllUsuarios().size();
            rolesCount = accesosService.getAllRoles().size();
            modulosCount = accesosService.getAllModulos().size();
        } catch (Exception e) {
            System.out.println("⚠️  Error contando registros: " + e.getMessage());
        }
        
        String status = String.format(
            "🚀 BACKEND CONECTADO CORRECTAMENTE\n" +
            "📊 Estadísticas:\n" +
            "   👥 Usuarios: %d\n" +
            "   🔑 Roles: %d\n" +
            "   📦 Módulos: %d\n" +
            "🔗 Endpoint: /api/accesos/test",
            usuariosCount, rolesCount, modulosCount
        );
        
        System.out.println(status);
        return ResponseEntity.ok(status);
        
    } catch (Exception e) {
        String error = "❌ ERROR en backend: " + e.getMessage();
        System.err.println(error);
        return ResponseEntity.status(500).body(error);
    }
}
}