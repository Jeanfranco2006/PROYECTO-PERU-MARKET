package com.perumarket.erp.repository;

import java.util.List;

import com.perumarket.erp.models.entity.Conductor;
import com.perumarket.erp.models.entity.Persona;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Long> {

    List<Conductor> findByEstado(Conductor.EstadoConductor estado);

    // 🔒 Evita que una persona tenga más de un conductor
    boolean existsByPersona(Persona persona);

    // 🔒 Evita licencias duplicadas
    boolean existsByLicencia(String licencia);

}
