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
        Persona personaInput = conductor.getPersona();

        // Validar que venga información de la persona
        if (personaInput != null) {
            // 1. Buscar si la persona ya existe por DNI
            Optional<Persona> personaExistente = personaRepository
                    .findByNumeroDocumento(personaInput.getNumeroDocumento());

            if (personaExistente.isPresent()) {
                // 2. Si existe, recuperamos la entidad y ACTUALIZAMOS sus datos
                Persona personaDb = personaExistente.get();
                personaDb.setNombres(personaInput.getNombres());
                personaDb.setApellidoPaterno(personaInput.getApellidoPaterno());
                personaDb.setApellidoMaterno(personaInput.getApellidoMaterno());
                personaDb.setCorreo(personaInput.getCorreo());
                personaDb.setTelefono(personaInput.getTelefono());
                personaDb.setDireccion(personaInput.getDireccion());
                personaDb.setFechaNacimiento(personaInput.getFechaNacimiento());
                
                // Guardamos los cambios de la persona y la asignamos
                conductor.setPersona(personaRepository.save(personaDb));
            } else {
                // 3. Si no existe, guardamos la persona nueva
                conductor.setPersona(personaRepository.save(personaInput));
            }
        }

        // 4. Finalmente guardamos el conductor con la relación establecida
        return conductorRepository.save(conductor);
    }
}
