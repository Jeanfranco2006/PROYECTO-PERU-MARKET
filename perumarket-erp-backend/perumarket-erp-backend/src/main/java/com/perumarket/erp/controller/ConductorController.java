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
        Conductor guardado = conductorService.crearDesdeDTO(dto);
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
