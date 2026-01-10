package com.perumarket.erp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.perumarket.erp.models.dto.ConductorDTO;
import com.perumarket.erp.models.entity.Conductor;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.service.ConductorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/conductores")
@RequiredArgsConstructor
public class ConductorController {

    private final ConductorService conductorService;

 @PostMapping
public ResponseEntity<Conductor> crearConductor(@RequestBody ConductorDTO dto) {
    Conductor conductor = new Conductor();

    // Crear objeto Persona
    Persona persona = new Persona();
    persona.setTipoDocumento(dto.getTipoDocumento());
    persona.setNumeroDocumento(dto.getNumeroDocumento());
    persona.setNombres(dto.getNombres());
    persona.setApellidoPaterno(dto.getApellidoPaterno());
    persona.setApellidoMaterno(dto.getApellidoMaterno());
    persona.setCorreo(dto.getCorreo());
    persona.setTelefono(dto.getTelefono());
    persona.setDireccion(dto.getDireccion());
    persona.setFechaNacimiento(dto.getFechaNacimiento());

    // Asignar Persona y datos del conductor
    conductor.setPersona(persona);
    conductor.setLicencia(dto.getLicencia());
    conductor.setCategoriaLicencia(dto.getCategoriaLicencia());
    conductor.setEstado(dto.getEstado());

    Conductor guardado = conductorService.save(conductor);
    return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
}


    @GetMapping
    public List<Conductor> listarTodos() {
        return conductorService.findAll();
    }

    @GetMapping("/disponibles")
    public List<Conductor> listarDisponibles() {
        return conductorService.findByEstado(Conductor.EstadoConductor.DISPONIBLE);
    }
}