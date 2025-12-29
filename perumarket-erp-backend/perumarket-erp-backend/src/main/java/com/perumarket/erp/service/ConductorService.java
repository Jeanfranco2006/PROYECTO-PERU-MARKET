package com.perumarket.erp.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.entity.Conductor;
import com.perumarket.erp.models.entity.Persona;
import com.perumarket.erp.repository.ConductorRepository;
import com.perumarket.erp.repository.PersonaRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConductorService {

    private final ConductorRepository conductorRepository;
    private final PersonaRepository personaRepository;

    public List<Conductor> findAll() {
        return conductorRepository.findAll();
    }

    public List<Conductor> findByEstado(Conductor.EstadoConductor estado) {
        return conductorRepository.findByEstado(estado);
    }

    @Transactional
    public Conductor save(Conductor conductor) {
        Persona persona = conductor.getPersona();

        // Buscar si la persona ya existe
        Optional<Persona> personaExistente = personaRepository
                .findByNumeroDocumento(persona.getNumeroDocumento());

        if (personaExistente.isPresent()) {
            conductor.setPersona(personaExistente.get());
        } else {
            // Guardar la persona nueva
            persona = personaRepository.save(persona);
            conductor.setPersona(persona);
        }

        // Guardar el conductor
        return conductorRepository.save(conductor);
    }
}
