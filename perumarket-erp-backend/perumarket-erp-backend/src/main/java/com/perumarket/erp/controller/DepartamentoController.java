package com.perumarket.erp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.perumarket.erp.models.dto.DepartamentoDTO;
import com.perumarket.erp.service.DepartamentoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/departamentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    @GetMapping
    public ResponseEntity<List<DepartamentoDTO>> getAllDepartamentos() {
        return ResponseEntity.ok(departamentoService.findAll());
    }

    @PostMapping
    public ResponseEntity<DepartamentoDTO> createDepartamento(@RequestBody DepartamentoDTO departamentoDTO) {
        return ResponseEntity.ok(departamentoService.save(departamentoDTO));
    }
}