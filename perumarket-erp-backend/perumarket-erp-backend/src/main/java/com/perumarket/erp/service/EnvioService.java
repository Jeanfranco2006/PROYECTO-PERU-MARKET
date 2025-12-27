package com.perumarket.erp.service;

import java.time.LocalDate;
import java.util.List;

import com.perumarket.erp.models.dto.AsignarEnvioDTO;
import com.perumarket.erp.models.dto.CrearEnvioDTO;
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
    // Buscar el pedido asociado a la venta
    Pedido pedido = pedidoRepository.findByVentaId(dto.getIdVenta())
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

    // Crear el envío
    Envio envio = new Envio();
    envio.setPedido(pedido);
    envio.setEstado(Envio.EstadoEnvio.PENDIENTE);
    envio.setFechaEnvio(null); // Se asigna cuando se despacha
    envio.setObservaciones("");

    // Guardar en BD
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

        if (conductor.getEstado() != Conductor.EstadoConductor.ACTIVO) {
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

}