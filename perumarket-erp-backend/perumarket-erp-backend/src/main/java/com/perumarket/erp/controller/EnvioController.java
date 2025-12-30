package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.dto.AsignarEnvioDTO;
import com.perumarket.erp.models.dto.EnvioDTO;
import com.perumarket.erp.models.dto.CrearEnvioDTO;
import com.perumarket.erp.models.entity.Envio;
import com.perumarket.erp.service.EnvioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/envios")

public class EnvioController {

    private final EnvioService envioService;

    public EnvioController(EnvioService envioService) {
        this.envioService = envioService;
    }

    @PostMapping
    public ResponseEntity<?> crearEnvio(@RequestBody CrearEnvioDTO dto) {
        try {
            Envio envioCreado = envioService.crearEnvio(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(envioCreado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/asignar")
    public ResponseEntity<Envio> asignarDespacho(
            @PathVariable Long id,
            @RequestBody AsignarEnvioDTO dto) {
        return ResponseEntity.ok(envioService.asignarDespacho(id, dto));
    }

    @GetMapping
public List<EnvioDTO> listarEnvios() {
    List<Envio> envios = envioService.listarTodos();

    return envios.stream().map(envio -> {
        // Nombre completo del cliente
        String nombreCliente = null;
        if (envio.getPedido() != null && envio.getPedido().getCliente() != null
                && envio.getPedido().getCliente().getPersona() != null) {
            nombreCliente = envio.getPedido().getCliente().getPersona().getNombres() + " " +
                            envio.getPedido().getCliente().getPersona().getApellidoPaterno() + " " +
                            envio.getPedido().getCliente().getPersona().getApellidoMaterno();
        }

        // Nombre completo del conductor
        String nombreConductor = null;
        if (envio.getConductor() != null && envio.getConductor().getPersona() != null) {
            nombreConductor = envio.getConductor().getPersona().getNombres() + " " +
                              envio.getConductor().getPersona().getApellidoPaterno() + " " +
                              envio.getConductor().getPersona().getApellidoMaterno();
        }

        // Placa del vehículo
        String placaVehiculo = envio.getVehiculo() != null ? envio.getVehiculo().getPlaca() : null;

        // Nombre de la ruta
        String nombreRuta = envio.getRuta() != null ? envio.getRuta().getNombre() : null;

        return new EnvioDTO(
                envio.getId(),
                envio.getEstado() != null ? envio.getEstado().name() : null,
                envio.getFechaEnvio(),
                envio.getFechaEntrega(),
                envio.getDireccionEnvio(),
                envio.getCostoTransporte() != null ? envio.getCostoTransporte().doubleValue() : null,
                envio.getPedido() != null ? envio.getPedido().getId() : null,
                envio.getPedido() != null && envio.getPedido().getTotal() != null
                        ? envio.getPedido().getTotal().doubleValue()
                        : null,
                envio.getPedido() != null && envio.getPedido().getCliente() != null
                        ? envio.getPedido().getCliente().getId()
                        : null,
                nombreCliente,
                envio.getConductor() != null ? envio.getConductor().getId() : null,
                nombreConductor,
                envio.getVehiculo() != null ? envio.getVehiculo().getId() : null,
                placaVehiculo,
                envio.getRuta() != null ? envio.getRuta().getId() : null,
                nombreRuta
        );
    }).toList();
}
@PutMapping("/{id}")
public ResponseEntity<?> actualizarEnvio(
        @PathVariable Long id,
        @RequestBody AsignarEnvioDTO dto
) {
    try {
        Envio envioActualizado = envioService.actualizarEnvio(id, dto);
        return ResponseEntity.ok(envioActualizado);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}


}
