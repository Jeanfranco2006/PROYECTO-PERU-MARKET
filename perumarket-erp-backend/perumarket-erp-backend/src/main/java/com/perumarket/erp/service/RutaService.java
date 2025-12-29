package com.perumarket.erp.service;

import java.util.List;

import com.perumarket.erp.models.entity.Ruta;
import com.perumarket.erp.repository.RutaRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RutaService {

    private final RutaRepository rutaRepository;

    public Ruta save(Ruta ruta) {
        return rutaRepository.save(ruta);
    }

    public List<Ruta> findAll() {
        return rutaRepository.findAll();
    }

    public Ruta findById(Long id) {
        return rutaRepository.findById(id).orElseThrow(() -> new RuntimeException("Ruta no encontrada"));
    }

    public void deleteById(Long id) {
        rutaRepository.deleteById(id);
    }
}