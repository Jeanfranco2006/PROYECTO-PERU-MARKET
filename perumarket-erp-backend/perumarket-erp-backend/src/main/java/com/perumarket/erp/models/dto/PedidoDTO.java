package com.perumarket.erp.models.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PedidoDTO {
    private Long id;
    private String codigo;
    private String clienteNombre;
    private BigDecimal total;
    private Integer idVenta;
    private boolean tieneEnvio;
    private String estadoEnvio; // Nuevo campo
    private LocalDateTime fechaPedido; // Nuevo campo

    // Constructor con 6 parámetros (para compatibilidad)
    public PedidoDTO(Long id, String codigo, String clienteNombre, BigDecimal total, 
                     Integer idVenta, boolean tieneEnvio) {
        this.id = id;
        this.codigo = codigo;
        this.clienteNombre = clienteNombre;
        this.total = total;
        this.idVenta = idVenta;
        this.tieneEnvio = tieneEnvio;
        this.estadoEnvio = tieneEnvio ? "PENDIENTE" : "SIN_ENVIO";
        this.fechaPedido = LocalDateTime.now();
    }

    // Constructor con 8 parámetros (nuevo)
    public PedidoDTO(Long id, String codigo, String clienteNombre, BigDecimal total, 
                     Integer idVenta, boolean tieneEnvio, String estadoEnvio, 
                     LocalDateTime fechaPedido) {
        this.id = id;
        this.codigo = codigo;
        this.clienteNombre = clienteNombre;
        this.total = total;
        this.idVenta = idVenta;
        this.tieneEnvio = tieneEnvio;
        this.estadoEnvio = estadoEnvio;
        this.fechaPedido = fechaPedido;
    }

    // Constructor vacío para frameworks
    public PedidoDTO() {
    }
}