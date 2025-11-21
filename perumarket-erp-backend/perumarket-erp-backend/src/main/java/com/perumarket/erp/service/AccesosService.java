// AccesosService.java
package com.perumarket.erp.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.CreateUsuarioRequest;
import com.perumarket.erp.models.dto.ModuloDTO;
import com.perumarket.erp.models.dto.RolDTO;
import com.perumarket.erp.models.dto.RolePermissionDTO;
import com.perumarket.erp.models.dto.UpdatePermissionsRequest;
import com.perumarket.erp.models.dto.UpdateUsuarioRequest;
import com.perumarket.erp.models.dto.UsuarioDTO;
import com.perumarket.erp.models.entity.Modulo;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.models.entity.Rol;
import com.perumarket.erp.models.entity.RoleModulePermissions;
import com.perumarket.erp.models.entity.Usuario;
import com.perumarket.erp.repository.ModuloRepository;
import com.perumarket.erp.repository.PersonaRepository;
import com.perumarket.erp.repository.RolRepository;
import com.perumarket.erp.repository.RoleModulePermissionsRepository;
import com.perumarket.erp.repository.UsuarioRepository;

@Service
public class AccesosService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private ModuloRepository moduloRepository;

    @Autowired
    private RoleModulePermissionsRepository permissionsRepository;

    // ========== USUARIOS ==========
    
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToUsuarioDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO getUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToUsuarioDTO(usuario);
    }

    @Transactional
    public UsuarioDTO createUsuario(CreateUsuarioRequest request) {
        // Validar que el username no exista
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }

        // Validar que el número de documento no exista
        if (personaRepository.existsByNumeroDocumento(request.getNumeroDocumento())) {
            throw new RuntimeException("El número de documento ya existe");
        }

        // Crear persona
        Persona persona = new Persona();
        persona.setTipoDocumento(request.getTipoDocumento());
        persona.setNumeroDocumento(request.getNumeroDocumento());
        persona.setNombres(request.getNombres());
        persona.setApellidoPaterno(request.getApellidoPaterno());
        persona.setApellidoMaterno(request.getApellidoMaterno());
        persona.setCorreo(request.getCorreo());
        persona.setTelefono(request.getTelefono());
        persona.setFechaNacimiento(LocalDate.parse(request.getFechaNacimiento()));
        persona.setDireccion(request.getDireccion());
        
        Persona savedPersona = personaRepository.save(persona);

        // Obtener rol
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setPersona(savedPersona);
        usuario.setRol(rol);
        usuario.setUsername(request.getUsername());
        usuario.setPassword(request.getPassword());
        usuario.setEstado(request.getEstado());

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return convertToUsuarioDTO(savedUsuario);
    }

    @Transactional
    public UsuarioDTO updateUsuario(Long id, UpdateUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Persona persona = usuario.getPersona();

        // Actualizar datos de persona
        persona.setTipoDocumento(request.getTipoDocumento());
        persona.setNumeroDocumento(request.getNumeroDocumento());
        persona.setNombres(request.getNombres());
        persona.setApellidoPaterno(request.getApellidoPaterno());
        persona.setApellidoMaterno(request.getApellidoMaterno());
        persona.setCorreo(request.getCorreo());
        persona.setTelefono(request.getTelefono());
        persona.setFechaNacimiento(LocalDate.parse(request.getFechaNacimiento()));
        persona.setDireccion(request.getDireccion());

        // Actualizar usuario
        usuario.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            usuario.setPassword(request.getPassword());
        }
        usuario.setEstado(request.getEstado());
        
        if (!usuario.getRol().getId().equals(request.getIdRol())) {
            Rol nuevoRol = rolRepository.findById(request.getIdRol())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            usuario.setRol(nuevoRol);
        }

        Usuario updatedUsuario = usuarioRepository.save(usuario);
        return convertToUsuarioDTO(updatedUsuario);
    }

    @Transactional
    public void deleteUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
    }

    private UsuarioDTO convertToUsuarioDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEstado(usuario.getEstado());

        // Datos de persona
        UsuarioDTO.PersonaDTO personaDTO = new UsuarioDTO.PersonaDTO();
        personaDTO.setId(usuario.getPersona().getId());
        personaDTO.setTipoDocumento(usuario.getPersona().getTipoDocumento());
        personaDTO.setNumeroDocumento(usuario.getPersona().getNumeroDocumento());
        personaDTO.setNombres(usuario.getPersona().getNombres());
        personaDTO.setApellidoPaterno(usuario.getPersona().getApellidoPaterno());
        personaDTO.setApellidoMaterno(usuario.getPersona().getApellidoMaterno());
        personaDTO.setCorreo(usuario.getPersona().getCorreo());
        personaDTO.setTelefono(usuario.getPersona().getTelefono());
        personaDTO.setFechaNacimiento(usuario.getPersona().getFechaNacimiento());
        personaDTO.setDireccion(usuario.getPersona().getDireccion());
        dto.setPersona(personaDTO);

        // Datos de rol
        UsuarioDTO.RolDTO rolDTO = new UsuarioDTO.RolDTO();
        rolDTO.setId(usuario.getRol().getId());
        rolDTO.setNombre(usuario.getRol().getNombre());
        rolDTO.setDescripcion(usuario.getRol().getDescripcion());
        dto.setRol(rolDTO);

        return dto;
    }

    // ========== ROLES ==========
    
    public List<RolDTO> getAllRoles() {
        return rolRepository.findAll().stream()
                .map(this::convertToRolDTO)
                .collect(Collectors.toList());
    }

    public RolDTO getRolById(Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        return convertToRolDTO(rol);
    }

    @Transactional
    public RolDTO createRol(RolDTO request) {
        if (rolRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe un rol con ese nombre");
        }

        Rol rol = new Rol();
        rol.setNombre(request.getNombre());
        rol.setDescripcion(request.getDescripcion());

        Rol savedRol = rolRepository.save(rol);
        return convertToRolDTO(savedRol);
    }

    @Transactional
    public RolDTO updateRol(Long id, RolDTO request) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        rol.setNombre(request.getNombre());
        rol.setDescripcion(request.getDescripcion());

        Rol updatedRol = rolRepository.save(rol);
        return convertToRolDTO(updatedRol);
    }

    @Transactional
    public void deleteRol(Long id) {
        // Verificar si hay usuarios con este rol
        Long userCount = rolRepository.countUsuariosByRolId(id);
        if (userCount > 0) {
            throw new RuntimeException("No se puede eliminar el rol porque tiene usuarios asignados");
        }

        rolRepository.deleteById(id);
    }

    private RolDTO convertToRolDTO(Rol rol) {
        RolDTO dto = new RolDTO();
        dto.setId(rol.getId());
        dto.setNombre(rol.getNombre());
        dto.setDescripcion(rol.getDescripcion());

        // Contar usuarios con este rol
        Long usuariosCount = rolRepository.countUsuariosByRolId(rol.getId());
        dto.setUsuariosCount(usuariosCount);

        // Contar módulos activos
        Long modulosActivosCount = permissionsRepository.findByRolId(rol.getId()).stream()
                .filter(RoleModulePermissions::getHasAccess)
                .count();
        dto.setModulosActivosCount(modulosActivosCount);

        return dto;
    }

    // ========== MÓDULOS ==========
    
    public List<ModuloDTO> getAllModulos() {
        return moduloRepository.findAll().stream()
                .map(this::convertToModuloDTO)
                .collect(Collectors.toList());
    }

    public ModuloDTO getModuloById(Long id) {
        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));
        return convertToModuloDTO(modulo);
    }

    @Transactional
    public ModuloDTO createModulo(ModuloDTO request) {
        Modulo modulo = new Modulo();
        modulo.setNombre(request.getNombre());
        modulo.setDescripcion(request.getDescripcion());
        modulo.setRuta(request.getRuta());

        Modulo savedModulo = moduloRepository.save(modulo);
        return convertToModuloDTO(savedModulo);
    }

    @Transactional
    public ModuloDTO updateModulo(Long id, ModuloDTO request) {
        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado"));

        modulo.setNombre(request.getNombre());
        modulo.setDescripcion(request.getDescripcion());
        modulo.setRuta(request.getRuta());

        Modulo updatedModulo = moduloRepository.save(modulo);
        return convertToModuloDTO(updatedModulo);
    }

    @Transactional
    public void deleteModulo(Long id) {
        moduloRepository.deleteById(id);
    }

    private ModuloDTO convertToModuloDTO(Modulo modulo) {
        ModuloDTO dto = new ModuloDTO();
        dto.setId(modulo.getId());
        dto.setNombre(modulo.getNombre());
        dto.setDescripcion(modulo.getDescripcion());
        dto.setRuta(modulo.getRuta());
        return dto;
    }

    // ========== PERMISOS ==========
    
    public List<RolePermissionDTO> getPermissionsByRol(Long rolId) {
    List<Modulo> modulos = moduloRepository.findAll();
    List<RoleModulePermissions> existingPermissions = permissionsRepository.findByRolId(rolId);

    return modulos.stream()
            .map(modulo -> {
                RolePermissionDTO dto = new RolePermissionDTO();
                dto.setIdModulo(modulo.getId());
                dto.setNombreModulo(modulo.getNombre());
                
                Optional<RoleModulePermissions> existing = existingPermissions.stream()
                        .filter(p -> p.getModulo().getId().equals(modulo.getId()))
                        .findFirst();
                
                dto.setHasAccess(existing.map(RoleModulePermissions::getHasAccess).orElse(false));
                return dto;
            })
            .collect(Collectors.toList());
}

    @Transactional
public void updatePermissions(UpdatePermissionsRequest request) {
    try {
        System.out.println("🔄 Iniciando actualización de permisos para rol ID: " + request.getIdRol());
        
        // 1. PRIMERO: Eliminar todos los permisos existentes del rol usando deleteByRolId
        permissionsRepository.deleteByRolId(request.getIdRol());
        System.out.println("🗑️ Permisos existentes eliminados para rol ID: " + request.getIdRol());
        
        // 2. SEGUNDO: Crear nuevos permisos solo para los que tienen acceso
        List<RoleModulePermissions> newPermissions = request.getPermissions().stream()
                .filter(RolePermissionDTO::getHasAccess)
                .map(perm -> {
                    RoleModulePermissions permission = new RoleModulePermissions();
                    
                    Rol rol = new Rol();
                    rol.setId(request.getIdRol());
                    permission.setRol(rol);
                    
                    Modulo modulo = new Modulo();
                    modulo.setId(perm.getIdModulo());
                    permission.setModulo(modulo);
                    
                    permission.setHasAccess(true);
                    
                    System.out.println("➕ Creando permiso - Rol: " + request.getIdRol() + ", Módulo: " + perm.getIdModulo());
                    return permission;
                })
                .collect(Collectors.toList());

        // 3. TERCERO: Guardar los nuevos permisos
        if (!newPermissions.isEmpty()) {
            permissionsRepository.saveAll(newPermissions);
            System.out.println("💾 Guardados " + newPermissions.size() + " nuevos permisos");
        } else {
            System.out.println("ℹ️ No hay permisos para guardar - todos los módulos están denegados");
        }
        
        System.out.println("✅ Permisos actualizados exitosamente para rol ID: " + request.getIdRol());
        
    } catch (Exception e) {
        System.err.println("❌ Error crítico actualizando permisos: " + e.getMessage());
        e.printStackTrace();
        throw new RuntimeException("Error al actualizar permisos: " + e.getMessage());
    }
}

    // Método auxiliar para obtener roles para dropdowns
    public List<RolDTO> getRolesForDropdown() {
        return rolRepository.findAll().stream()
                .map(rol -> {
                    RolDTO dto = new RolDTO();
                    dto.setId(rol.getId());
                    dto.setNombre(rol.getNombre());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}