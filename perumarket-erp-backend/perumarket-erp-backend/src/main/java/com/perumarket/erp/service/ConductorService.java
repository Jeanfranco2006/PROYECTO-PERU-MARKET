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

    // 1️⃣ Buscar o crear persona por DNI
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

    // 2️⃣ Validar que la persona NO sea ya conductor
    if (conductorRepository.existsByPersona(persona)) {
        throw new RuntimeException("La persona con este DNI ya está registrada como conductor");
    }
        // 4️⃣ VALIDAR: licencia única
    if (conductorRepository.existsByLicencia(dto.getLicencia())) {
        throw new RuntimeException("La licencia ya está registrada");
    }

    // 5️⃣ VALIDAR CAMPOS DE CONDUCTOR
    if (dto.getLicencia() == null || dto.getLicencia().isBlank()) {
        throw new RuntimeException("La licencia es obligatoria");
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
