package com.perumarket.erp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.DepartamentoDTO;
import com.perumarket.erp.models.dto.EmpleadoDTO;
import com.perumarket.erp.models.dto.PersonaDTO;
import com.perumarket.erp.models.entity.Departamento;
import com.perumarket.erp.models.entity.Empleado;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.repository.DepartamentoRepository;
import com.perumarket.erp.repository.EmpleadoRepository;
import com.perumarket.erp.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final PersonaRepository personaRepository;
    private final DepartamentoRepository departamentoRepository;

    public List<EmpleadoDTO> findAll() {
        return empleadoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<EmpleadoDTO> findById(Long id) {
        return empleadoRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<EmpleadoDTO> findByFilters(String texto, String dni, String estado) {
        Empleado.EstadoEmpleado estadoEnum = null;
        if (estado != null && !estado.isEmpty()) {
            try {
                estadoEnum = Empleado.EstadoEmpleado.valueOf(estado.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Si el estado no es válido, se ignora el filtro
            }
        }

        return empleadoRepository.findByFilters(
                texto != null && !texto.isEmpty() ? texto : null,
                dni != null && !dni.isEmpty() ? dni : null,
                estadoEnum
        ).stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
    }

    @Transactional
    public EmpleadoDTO save(EmpleadoDTO empleadoDTO) {
        // Buscar o crear persona
        Persona persona = personaRepository.findByNumeroDocumento(empleadoDTO.getPersona().getNumeroDocumento())
                .orElse(new Persona());
        
        // Actualizar datos de persona
        updatePersonaFromDTO(persona, empleadoDTO.getPersona());
        persona = personaRepository.save(persona);

        // Buscar departamento si está presente
        Departamento departamento = null;
        if (empleadoDTO.getDepartamento() != null && empleadoDTO.getDepartamento().getId() != null) {
            departamento = departamentoRepository.findById(empleadoDTO.getDepartamento().getId())
                    .orElse(null);
        }

        // Crear o actualizar empleado
        Empleado empleado = new Empleado();
        if (empleadoDTO.getEmpleadoId() != null) {
            empleado = empleadoRepository.findById(empleadoDTO.getEmpleadoId())
                    .orElse(new Empleado());
        }

        empleado.setPersona(persona);
        empleado.setDepartamento(departamento);
        empleado.setPuesto(empleadoDTO.getPuesto());
        empleado.setSueldo(empleadoDTO.getSueldo());
        empleado.setFechaContratacion(empleadoDTO.getFechaContratacion());
        empleado.setFoto(empleadoDTO.getFoto());
        empleado.setCv(empleadoDTO.getCv());
        
        if (empleadoDTO.getEstado() != null) {
            empleado.setEstado(Empleado.EstadoEmpleado.valueOf(empleadoDTO.getEstado().toUpperCase()));
        }

        empleado = empleadoRepository.save(empleado);
        return convertToDTO(empleado);
    }

    @Transactional
    public void deleteById(Long id) {
        empleadoRepository.deleteById(id);
    }

    private void updatePersonaFromDTO(Persona persona, com.perumarket.erp.models.dto.PersonaDTO personaDTO) {
        persona.setTipoDocumento(personaDTO.getTipoDocumento());
        persona.setNumeroDocumento(personaDTO.getNumeroDocumento());
        persona.setNombres(personaDTO.getNombres());
        persona.setApellidoPaterno(personaDTO.getApellidoPaterno());
        persona.setApellidoMaterno(personaDTO.getApellidoMaterno());
        persona.setCorreo(personaDTO.getCorreo());
        persona.setTelefono(personaDTO.getTelefono());
        persona.setFechaNacimiento(personaDTO.getFechaNacimiento());
        persona.setDireccion(personaDTO.getDireccion());
    }

    private EmpleadoDTO convertToDTO(Empleado empleado) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setEmpleadoId(empleado.getId());
        
        PersonaDTO personaDTO = new PersonaDTO();
        personaDTO.setId(empleado.getPersona().getId());
        personaDTO.setTipoDocumento(empleado.getPersona().getTipoDocumento());
        personaDTO.setNumeroDocumento(empleado.getPersona().getNumeroDocumento());
        personaDTO.setNombres(empleado.getPersona().getNombres());
        personaDTO.setApellidoPaterno(empleado.getPersona().getApellidoPaterno());
        personaDTO.setApellidoMaterno(empleado.getPersona().getApellidoMaterno());
        personaDTO.setCorreo(empleado.getPersona().getCorreo());
        personaDTO.setTelefono(empleado.getPersona().getTelefono());
        personaDTO.setFechaNacimiento(empleado.getPersona().getFechaNacimiento());
        personaDTO.setDireccion(empleado.getPersona().getDireccion());
        
        dto.setPersona(personaDTO);

        if (empleado.getDepartamento() != null) {
            DepartamentoDTO departamentoDTO = new DepartamentoDTO();
            departamentoDTO.setId(empleado.getDepartamento().getId());
            departamentoDTO.setNombre(empleado.getDepartamento().getNombre());
            departamentoDTO.setDescripcion(empleado.getDepartamento().getDescripcion());
            dto.setDepartamento(departamentoDTO);
        }

        dto.setPuesto(empleado.getPuesto());
        dto.setSueldo(empleado.getSueldo());
        dto.setFechaContratacion(empleado.getFechaContratacion());
        dto.setEstado(empleado.getEstado().name());
        dto.setFoto(empleado.getFoto());
        dto.setCv(empleado.getCv());

        return dto;
    }
}