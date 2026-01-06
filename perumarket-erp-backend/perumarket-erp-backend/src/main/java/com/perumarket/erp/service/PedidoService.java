package com.perumarket.erp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.PedidoDTO;
import com.perumarket.erp.models.entity.Pedido;
import com.perumarket.erp.repository.PedidoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarPedidosPendientes() {
        return pedidoRepository.findByEstado(Pedido.EstadoPedido.PENDIENTE);
    }

    @Transactional(readOnly = true)
    public List<PedidoDTO> listarPedidosPendientesDTO() {
        System.out.println("=== PedidoService.listarPedidosPendientesDTO() ===");
        
        // 1. Obtener pedidos del repositorio
        List<Pedido> pedidos = pedidoRepository.findPedidosPendientesConVentaYEnvio();
        System.out.println("Pedidos desde repositorio: " + pedidos.size());
        
        // 2. Verificar contenido
        for (Pedido p : pedidos) {
            System.out.println(String.format(
                "Pedido ID: %d, Estado: %s, TieneEnvio: %s, EstadoEnvio: %s, FechaEnvio: %s",
                p.getId(),
                p.getEstado(),
                p.getEnvio() != null,
                p.getEnvio() != null ? p.getEnvio().getEstado() : "N/A",
                p.getEnvio() != null ? p.getEnvio().getFechaEnvio() : "N/A"
            ));
        }
        
        // 3. Convertir a DTO
        return pedidos.stream()
            .map(p -> {
                String clienteNombre = "Sin cliente";
                if (p.getCliente() != null && p.getCliente().getPersona() != null) {
                    clienteNombre = p.getCliente().getPersona().getNombres();
                    if (p.getCliente().getPersona().getApellidoPaterno() != null) {
                        clienteNombre += " " + p.getCliente().getPersona().getApellidoPaterno();
                    }
                }
                
                boolean tieneEnvio = p.getEnvio() != null;
                String estadoEnvio = tieneEnvio ? p.getEnvio().getEstado().name() : "SIN_ENVIO";
                
                // Debug adicional
                if (tieneEnvio) {
                    System.out.println(String.format(
                        "DEBUG - Pedido %d: estadoEnvio=%s, fechaEnvio=%s",
                        p.getId(), estadoEnvio, p.getEnvio().getFechaEnvio()
                    ));
                }
                
                return new PedidoDTO(
                    p.getId(),
                    "PED-" + p.getId(),
                    clienteNombre,
                    p.getTotal(),
                    p.getVenta() != null ? p.getVenta().getId() : null,
                    tieneEnvio,
                    estadoEnvio,
                    p.getFechaPedido()
                );
            })
            .toList();
    }

    
    // NUEVO MÉTODO: Pedidos disponibles para envío
    @Transactional(readOnly = true)
    public List<PedidoDTO> listarPedidosDisponiblesParaEnvio() {
        // Asegúrate que este método exista en PedidoRepository
        return pedidoRepository.findPedidosDisponiblesParaEnvio()
            .stream()
            .map(this::convertirAPedidoDTO)
            .toList();
    }
    
    private PedidoDTO convertirAPedidoDTO(Pedido p) {
        boolean tieneEnvio = p.getEnvio() != null;
        String estadoEnvio = tieneEnvio ? p.getEnvio().getEstado().name() : "SIN_ENVIO";
        
        String clienteNombre = "Sin cliente";
        if (p.getCliente() != null && p.getCliente().getPersona() != null) {
            clienteNombre = p.getCliente().getPersona().getNombres();
            if (p.getCliente().getPersona().getApellidoPaterno() != null) {
                clienteNombre += " " + p.getCliente().getPersona().getApellidoPaterno();
            }
        }
        
        return new PedidoDTO(
            p.getId(),
            "PED-" + p.getId(),
            clienteNombre,
            p.getTotal(),
            p.getVenta() != null ? p.getVenta().getId() : null,
            tieneEnvio,
            estadoEnvio,
            p.getFechaPedido()
        );
    }
}