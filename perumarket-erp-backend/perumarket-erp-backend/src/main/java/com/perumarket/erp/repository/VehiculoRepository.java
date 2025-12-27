package com.perumarket.erp.repository;

import java.util.List;

import com.perumarket.erp.models.entity.Vehiculo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
        List<Vehiculo> findByEstado(Vehiculo.EstadoVehiculo estado);
}
