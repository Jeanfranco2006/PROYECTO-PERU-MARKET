package com.perumarket.erp.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.perumarket.erp.models.dto.AsignarEnvioDTO;
import com.perumarket.erp.models.dto.CrearEnvioDTO;
import com.perumarket.erp.models.dto.EnvioDTO;
import com.perumarket.erp.models.entity.Conductor;
import com.perumarket.erp.models.entity.Envio;
import com.perumarket.erp.models.entity.Pedido;
import com.perumarket.erp.models.entity.Ruta;
import com.perumarket.erp.models.entity.Vehiculo;
import com.perumarket.erp.repository.ConductorRepository;
import com.perumarket.erp.repository.EnvioRepository;
import com.perumarket.erp.repository.PedidoRepository;
import com.perumarket.erp.repository.RutaRepository;
import com.perumarket.erp.repository.VehiculoRepository;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class EnvioService {

    private final EnvioRepository envioRepository;
    private final VehiculoRepository vehiculoRepository;
    private final ConductorRepository conductorRepository;
    private final RutaRepository rutaRepository;
    private final PedidoRepository pedidoRepository;

    public EnvioService(
            EnvioRepository envioRepository,
            VehiculoRepository vehiculoRepository,
            ConductorRepository conductorRepository,
            RutaRepository rutaRepository,
            PedidoRepository pedidoRepository) { // ✅ agregar aquí
        this.envioRepository = envioRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.conductorRepository = conductorRepository;
        this.rutaRepository = rutaRepository;
        this.pedidoRepository = pedidoRepository; // ✅ asignar a la variable
    }



        @Transactional(readOnly = true)
    public List<Envio> listarTodos() {
        return envioRepository.findAll();
    }
@Transactional
public Envio crearEnvio(CrearEnvioDTO dto) {
    Pedido pedido = pedidoRepository.findByVentaId(dto.getIdVenta())
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

    Envio envio = new Envio();
    envio.setPedido(pedido);
    envio.setEstado(Envio.EstadoEnvio.PENDIENTE);
    envio.setFechaEnvio(dto.getFechaEnvio() != null ? LocalDate.parse(dto.getFechaEnvio()) : null);
    envio.setDireccionEnvio(dto.getDireccionEnvio());
    envio.setFechaEntrega(dto.getFechaEntrega() != null ? LocalDate.parse(dto.getFechaEntrega()) : null);
    envio.setCostoTransporte(dto.getCostoTransporte());
    envio.setObservaciones(dto.getObservaciones());

    if (dto.getIdVehiculo() != null) {
        Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
        envio.setVehiculo(vehiculo);
    }

    if (dto.getIdConductor() != null) {
        Conductor conductor = conductorRepository.findById(dto.getIdConductor())
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));
        envio.setConductor(conductor);
    }

    if (dto.getIdRuta() != null) {
        Ruta ruta = rutaRepository.findById(dto.getIdRuta())
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));
        envio.setRuta(ruta);
    }

    return envioRepository.save(envio);
}


    @Transactional
    public Envio asignarDespacho(Long envioId, AsignarEnvioDTO dto) {

        Envio envio = envioRepository.findById(envioId)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado"));

        if (envio.getEstado() != Envio.EstadoEnvio.PENDIENTE) {
            throw new RuntimeException("El envío ya fue despachado");
        }

        Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo())
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        if (vehiculo.getEstado() != Vehiculo.EstadoVehiculo.DISPONIBLE) {
            throw new RuntimeException("El vehículo no está disponible");
        }

        Conductor conductor = conductorRepository.findById(dto.getIdConductor())
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

        if (conductor.getEstado() != Conductor.EstadoConductor.DISPONIBLE) {
            throw new RuntimeException("El conductor no está activo");
        }

        Ruta ruta = rutaRepository.findById(dto.getIdRuta())
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        envio.setVehiculo(vehiculo);
        envio.setConductor(conductor);
        envio.setRuta(ruta);
        envio.setEstado(Envio.EstadoEnvio.EN_RUTA);
        envio.setFechaEnvio(LocalDate.now());
        envio.setObservaciones(dto.getObservaciones());

        envio.getPedido().setEstado(
                com.perumarket.erp.models.entity.Pedido.EstadoPedido.EN_CAMINO);

        vehiculo.setEstado(Vehiculo.EstadoVehiculo.EN_RUTA);
        vehiculoRepository.save(vehiculo);

        return envioRepository.save(envio);
    }
@Transactional
    public Envio actualizarEnvio(Long id, AsignarEnvioDTO dto) {

        Envio envio = envioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado"));

        // 1. Actualizar Relaciones (Solo si vienen datos nuevos)
        if (dto.getIdVehiculo() != null) {
            envio.setVehiculo(vehiculoRepository.findById(dto.getIdVehiculo())
                    .orElseThrow(() -> new RuntimeException("Vehículo no encontrado")));
        }

        if (dto.getIdConductor() != null) {
            envio.setConductor(conductorRepository.findById(dto.getIdConductor())
                    .orElseThrow(() -> new RuntimeException("Conductor no encontrado")));
        }

        if (dto.getIdRuta() != null) {
            envio.setRuta(rutaRepository.findById(dto.getIdRuta())
                    .orElseThrow(() -> new RuntimeException("Ruta no encontrada")));
        }

        // 2. Actualizar Datos (Validando nulls para no borrar datos existentes)
        if (dto.getDireccionEnvio() != null) {
            envio.setDireccionEnvio(dto.getDireccionEnvio());
        }

        if (dto.getFechaEnvio() != null) {
            envio.setFechaEnvio(LocalDate.parse(dto.getFechaEnvio()));
        }

        if (dto.getFechaEntrega() != null && !dto.getFechaEntrega().isEmpty()) {
            envio.setFechaEntrega(LocalDate.parse(dto.getFechaEntrega()));
        }

        // ✅ ESTO FALTABA: Actualizar el Costo
        if (dto.getCostoTransporte() != null) {
            envio.setCostoTransporte(dto.getCostoTransporte());
        }

        if (dto.getEstado() != null) {
            envio.setEstado(Envio.EstadoEnvio.valueOf(dto.getEstado()));
        }

        if (dto.getObservaciones() != null) {
            envio.setObservaciones(dto.getObservaciones());
        }

        return envioRepository.save(envio);
    }

}