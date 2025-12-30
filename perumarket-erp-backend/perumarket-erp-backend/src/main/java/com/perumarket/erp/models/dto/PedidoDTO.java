package com.perumarket.erp.models.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PedidoDTO {
    private Long id;
    private String codigo;
    private String clienteNombre;
    private BigDecimal total;
    private Integer idVenta;
    private boolean tieneEnvio;

    public PedidoDTO(Long id, String codigo, String clienteNombre, BigDecimal total, Integer idVenta, boolean tieneEnvio) {
        this.id = id;
        this.codigo = codigo;
        this.clienteNombre = clienteNombre;
        this.total = total;
        this.idVenta = idVenta;
        this.tieneEnvio = tieneEnvio;
    }

    // getters y setters (o usar lombok @Data)
}
