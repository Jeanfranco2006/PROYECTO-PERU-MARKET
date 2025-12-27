package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.entity.Vehiculo;
import com.perumarket.erp.repository.VehiculoRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoController(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    @GetMapping("/disponibles")
    public List<Vehiculo> listarDisponibles() {
        return vehiculoRepository.findByEstado(Vehiculo.EstadoVehiculo.DISPONIBLE);
    }
}
