package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.dto.VehiculoDTO;
import com.perumarket.erp.models.entity.Vehiculo;
import com.perumarket.erp.repository.VehiculoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoController(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    // 🔹 LISTAR TODOS
    @GetMapping
    public List<Vehiculo> listarTodos() {
        return vehiculoRepository.findAll();
    }

    // 🔹 LISTAR DISPONIBLES
    @GetMapping("/disponibles")
    public List<Vehiculo> listarDisponibles() {
        return vehiculoRepository.findByEstado(Vehiculo.EstadoVehiculo.DISPONIBLE);
    }

    // 🔹 REGISTRAR CON DTO
    @PostMapping
    public ResponseEntity<Vehiculo> registrar(@RequestBody VehiculoDTO dto) {

        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setPlaca(dto.getPlaca());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setCapacidadKg(dto.getCapacidadKg());

        vehiculo.setEstado(
            dto.getEstado() != null
                ? Vehiculo.EstadoVehiculo.valueOf(dto.getEstado())
                : Vehiculo.EstadoVehiculo.DISPONIBLE
        );

        Vehiculo guardado = vehiculoRepository.save(vehiculo);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }
}
