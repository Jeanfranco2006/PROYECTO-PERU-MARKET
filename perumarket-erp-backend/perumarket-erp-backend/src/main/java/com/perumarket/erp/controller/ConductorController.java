package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.entity.Conductor;
import com.perumarket.erp.repository.ConductorRepository;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/conductores")
public class ConductorController {

    private final ConductorRepository conductorRepository;

    public ConductorController(ConductorRepository conductorRepository) {
        this.conductorRepository = conductorRepository;
    }

        @GetMapping
    public List<Conductor> listarTodos() {
        return conductorRepository.findAll();
    }
    @GetMapping("/disponibles")
    public List<Conductor> listarDisponibles() {
        return conductorRepository.findByEstado(Conductor.EstadoConductor.DISPONIBLE);
    }
}