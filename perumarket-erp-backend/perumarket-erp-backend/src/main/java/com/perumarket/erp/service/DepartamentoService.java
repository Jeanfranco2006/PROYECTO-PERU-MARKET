package com.perumarket.erp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.perumarket.erp.models.dto.DepartamentoDTO;
import com.perumarket.erp.models.entity.Departamento;
import com.perumarket.erp.repository.DepartamentoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;

    public List<DepartamentoDTO> findAll() {
        return departamentoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DepartamentoDTO save(DepartamentoDTO departamentoDTO) {
        Departamento departamento = new Departamento();
        if (departamentoDTO.getId() != null) {
            departamento = departamentoRepository.findById(departamentoDTO.getId())
                    .orElse(new Departamento());
        }
        
        departamento.setNombre(departamentoDTO.getNombre());
        departamento.setDescripcion(departamentoDTO.getDescripcion());
        
        departamento = departamentoRepository.save(departamento);
        return convertToDTO(departamento);
    }

    private DepartamentoDTO convertToDTO(Departamento departamento) {
        DepartamentoDTO dto = new DepartamentoDTO();
        dto.setId(departamento.getId());
        dto.setNombre(departamento.getNombre());
        dto.setDescripcion(departamento.getDescripcion());
        return dto;
    }
}