package com.perumarket.erp.controller;

import com.perumarket.erp.repository.PersonaRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/personas")
@RequiredArgsConstructor
public class PersonaController {
    private final PersonaRepository personaRepository;

    @GetMapping("/existe-dni/{dni}")
    public ResponseEntity<Boolean> existeDni(@PathVariable String dni) {
        boolean existe = personaRepository.existsByNumeroDocumento(dni);
        return ResponseEntity.ok(existe);
    }
}
