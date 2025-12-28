package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.entity.Vehiculo;
import com.perumarket.erp.repository.VehiculoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoController(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }
        @GetMapping
    public List<Vehiculo> listarTodos() {
        return vehiculoRepository.findAll();
    }
    @GetMapping("/disponibles")
    public List<Vehiculo> listarDisponibles() {
        return vehiculoRepository.findByEstado(Vehiculo.EstadoVehiculo.DISPONIBLE);
    }
    
        @PostMapping
public ResponseEntity<Vehiculo> registrar(@RequestBody Vehiculo vehiculo) {
    Vehiculo guardado = vehiculoRepository.save(vehiculo);
    return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
}
}
