package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.dto.AsignarEnvioDTO;
import com.perumarket.erp.models.dto.CrearEnvioDTO;
import com.perumarket.erp.models.entity.Envio;
import com.perumarket.erp.service.EnvioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/envios")

public class EnvioController {


    private final EnvioService envioService;

    public EnvioController(EnvioService envioService) {
        this.envioService = envioService;
    }

@PostMapping
public ResponseEntity<?> crearEnvio(@RequestBody CrearEnvioDTO dto) {
    try {
        Envio envioCreado = envioService.crearEnvio(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(envioCreado);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}


    @PutMapping("/{id}/asignar")
    public ResponseEntity<Envio> asignarDespacho(
            @PathVariable Long id,
            @RequestBody AsignarEnvioDTO dto) {
        return ResponseEntity.ok(envioService.asignarDespacho(id, dto));
    }
        @GetMapping
    public List<Envio> listarEnvios() {
        return envioService.listarTodos(); // retorna todos los envíos
    }
}

