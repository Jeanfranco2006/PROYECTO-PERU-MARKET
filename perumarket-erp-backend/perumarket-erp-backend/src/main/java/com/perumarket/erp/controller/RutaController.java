package com.perumarket.erp.controller;

import com.perumarket.erp.models.dto.RutaDTO;
import com.perumarket.erp.models.entity.Ruta;
import com.perumarket.erp.service.RutaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rutas")
@RequiredArgsConstructor
public class RutaController {

    private final RutaService rutaService;

@PostMapping
public ResponseEntity<Ruta> crearRuta(@RequestBody RutaDTO dto) {
    Ruta ruta = new Ruta();
    ruta.setNombre(dto.getNombre());
    ruta.setOrigen(dto.getOrigen());
    ruta.setDestino(dto.getDestino());
    ruta.setDistanciaKm(dto.getDistancia_km());
    ruta.setTiempoEstimadoHoras(dto.getTiempo_estimado_horas());
    ruta.setCostoBase(dto.getCosto_base());

    Ruta saved = rutaService.save(ruta);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}



    @GetMapping
    public List<Ruta> listarRutas() {
        return rutaService.findAll();
    }

    @GetMapping("/{id}")
    public Ruta obtenerRuta(@PathVariable Long id) {
        return rutaService.findById(id);
    }

    @PutMapping("/{id}")
    public Ruta actualizarRuta(@PathVariable Long id, @RequestBody Ruta ruta) {
        Ruta r = rutaService.findById(id);
        r.setNombre(ruta.getNombre());
        r.setOrigen(ruta.getOrigen());
        r.setDestino(ruta.getDestino());
        r.setDistanciaKm(ruta.getDistanciaKm());
        r.setTiempoEstimadoHoras(ruta.getTiempoEstimadoHoras());
        r.setCostoBase(ruta.getCostoBase());
        return rutaService.save(r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRuta(@PathVariable Long id) {
        rutaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
