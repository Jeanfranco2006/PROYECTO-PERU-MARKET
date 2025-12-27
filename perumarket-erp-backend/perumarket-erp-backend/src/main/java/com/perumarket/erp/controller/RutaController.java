package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.entity.Ruta;
import com.perumarket.erp.repository.RutaRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rutas")
public class RutaController {

    private final RutaRepository rutaRepository;

    public RutaController(RutaRepository rutaRepository) {
        this.rutaRepository = rutaRepository;
    }

    @GetMapping
    public List<Ruta> listar() {
        return rutaRepository.findAll();
    }
}
