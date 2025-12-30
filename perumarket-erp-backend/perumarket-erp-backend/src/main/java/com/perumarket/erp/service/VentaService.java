package com.perumarket.erp.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.perumarket.erp.models.dto.DetalleVentaDTO;
import com.perumarket.erp.models.dto.DetalleVentaResponseDTO;
import com.perumarket.erp.models.dto.VentaDTO;
import com.perumarket.erp.models.dto.VentaResponseDTO;
import com.perumarket.erp.models.entity.Cliente;
import com.perumarket.erp.models.entity.DetalleVenta;
import com.perumarket.erp.models.entity.Envio;
import com.perumarket.erp.models.entity.Inventario;
import com.perumarket.erp.models.entity.Pedido;
import com.perumarket.erp.models.entity.Producto;
import com.perumarket.erp.models.entity.Usuario;
import com.perumarket.erp.models.entity.Venta;
import com.perumarket.erp.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final PedidoRepository pedidoRepository;

    private final VentaRepository ventaRepository;
    private final InventarioRepository inventarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final EnvioRepository envioRepository;


  @Transactional
public Venta procesarVenta(VentaDTO dto) {

    Usuario usuario = usuarioRepository.findUsuarioById(dto.getIdUsuario().longValue())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    Venta venta = new Venta();
    venta.setUsuario(usuario);
    venta.setIdCliente(dto.getIdCliente());
    venta.setIdAlmacen(dto.getIdAlmacen());
    venta.setSubtotal(dto.getSubtotal());
    venta.setDescuentoTotal(dto.getDescuentoTotal() != null ? dto.getDescuentoTotal() : 0.0);
    venta.setIgv(dto.getIgv());
    venta.setTotal(dto.getTotal());
    venta.setEstado(Venta.EstadoVenta.PENDIENTE);
    venta.setFecha(LocalDateTime.now());

    List<DetalleVenta> detalles = new ArrayList<>();

    for (DetalleVentaDTO det : dto.getDetalles()) {
        Inventario inventario = inventarioRepository
                .findByProductoIdAndAlmacenId(det.getIdProducto(), dto.getIdAlmacen())
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));

        if (inventario.getStockActual() < det.getCantidad()) {
            throw new RuntimeException("Stock insuficiente");
        }

        inventario.setStockActual(inventario.getStockActual() - det.getCantidad());
        inventarioRepository.save(inventario);

        DetalleVenta dv = new DetalleVenta();
        dv.setIdProducto(det.getIdProducto());
        dv.setCantidad(det.getCantidad());
        dv.setPrecioUnitario(det.getPrecioUnitario());
        dv.setSubtotal(det.getSubtotal());
        dv.setVenta(venta);
        detalles.add(dv);
    }

    venta.setDetalles(detalles);
    Venta ventaGuardada = ventaRepository.save(venta);

    // ✅ CREAR PEDIDO
    Cliente cliente = clienteRepository.findById(dto.getIdCliente().longValue())
            .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

    Pedido pedido = new Pedido();
    pedido.setVenta(ventaGuardada);
    pedido.setCliente(cliente);
    pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
    pedido.setTotal(BigDecimal.valueOf(ventaGuardada.getTotal()));
    pedido.setFechaPedido(LocalDateTime.now()); // 🔥 CLAVE

    pedidoRepository.save(pedido);

    // ✅ CREAR ENVÍO AUTOMÁTICO
Envio envio = new Envio();
envio.setPedido(pedido);
envio.setEstado(Envio.EstadoEnvio.PENDIENTE);
envio.setFechaEnvio(LocalDate.now()); // o LocalDateTime si tu entidad lo usa

envioRepository.save(envio);


    return ventaGuardada;
}


    @Transactional(readOnly = true)
    public VentaResponseDTO obtenerVentaConDetallesConImagen(Integer ventaId) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada ID: " + ventaId));

        // Traemos todos los IDs de productos para optimizar consultas
        List<Integer> productoIds = venta.getDetalles().stream()
                .map(DetalleVenta::getIdProducto)
                .toList();

        Map<Integer, Producto> productosMap = productoRepository.findAllById(productoIds).stream()
                .collect(Collectors.toMap(Producto::getId, p -> p));

        // Construimos los DetalleVentaResponseDTO con nombre e imagen
        List<DetalleVentaResponseDTO> detallesDTO = venta.getDetalles().stream()
                .map(det -> {
                    DetalleVentaResponseDTO dto = new DetalleVentaResponseDTO(det);
                    Producto producto = productosMap.get(det.getIdProducto());
                    if (producto != null) {
                        dto.setNombreProducto(producto.getNombre());
                        dto.setImagen(producto.getImagen());
                    }
                    return dto;
                }).toList();

        VentaResponseDTO ventaDTO = new VentaResponseDTO();
        ventaDTO.setId(venta.getId());
        ventaDTO.setSubtotal(venta.getSubtotal());
        ventaDTO.setDescuentoTotal(venta.getDescuentoTotal());
        ventaDTO.setIgv(venta.getIgv());
        ventaDTO.setTotal(venta.getTotal());
        ventaDTO.setIdCliente(venta.getIdCliente());
        ventaDTO.setIdAlmacen(venta.getIdAlmacen());
        ventaDTO.setEstado(venta.getEstado().name());
        ventaDTO.setDetalles(detallesDTO);

        return ventaDTO;
    }

    @Transactional(readOnly = true)
    public List<VentaResponseDTO> listarVentasConImagen() {
        return ventaRepository.findAll().stream()
                .map(v -> obtenerVentaConDetallesConImagen(v.getId()))
                .toList();
    }
}
