package com.perumarket.erp.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.ConductorDTO;
import com.perumarket.erp.models.entity.Conductor;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.repository.ConductorRepository;
import com.perumarket.erp.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ConductorService {

    private final ConductorRepository conductorRepository;
    private final PersonaRepository personaRepository;

    @Transactional
    public Conductor crearDesdeDTO(ConductorDTO dto) {

        // 1️⃣ Buscar persona por documento
        Persona persona = personaRepository
                .findByNumeroDocumento(dto.getNumeroDocumento())
                .orElseGet(() -> {
                    Persona p = new Persona();
                    p.setTipoDocumento(dto.getTipoDocumento());
                    p.setNumeroDocumento(dto.getNumeroDocumento());
                    p.setNombres(dto.getNombres());
                    p.setApellidoPaterno(dto.getApellidoPaterno());
                    p.setApellidoMaterno(dto.getApellidoMaterno());
                    p.setCorreo(dto.getCorreo());
                    p.setTelefono(dto.getTelefono());
                    p.setDireccion(dto.getDireccion());
                    p.setFechaNacimiento(dto.getFechaNacimiento());
                    return personaRepository.save(p);
                });

        // 2️⃣ Crear conductor
        Conductor conductor = new Conductor();
        conductor.setPersona(persona);
        conductor.setLicencia(dto.getLicencia());
        conductor.setCategoriaLicencia(dto.getCategoriaLicencia());
        conductor.setEstado(
                dto.getEstado() != null
                        ? dto.getEstado()
                        : Conductor.EstadoConductor.DISPONIBLE
        );

        return conductorRepository.save(conductor);
    }

    public List<Conductor> findAll() {
        return conductorRepository.findAll();
    }

    public List<Conductor> findByEstado(Conductor.EstadoConductor estado) {
        return conductorRepository.findByEstado(estado);
    }
}
