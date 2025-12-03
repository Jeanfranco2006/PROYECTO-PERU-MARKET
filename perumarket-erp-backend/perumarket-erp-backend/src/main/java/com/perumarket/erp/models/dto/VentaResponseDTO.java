package com.perumarket.erp.models.dto;

import java.util.List;

import lombok.Data;

@Data
public class VentaResponseDTO {
    private Integer id;
    private Double subtotal;
    private Double descuentoTotal;
    private Double igv;
    private Double total;
    private Integer idCliente;
    private Integer idAlmacen;
    private String estado;
    private List<DetalleVentaResponseDTO> detalles;

    public VentaResponseDTO() {}

    public VentaResponseDTO(com.perumarket.erp.models.entity.Venta venta) {
        this.id = venta.getId();
        this.subtotal = venta.getSubtotal();
        this.descuentoTotal = venta.getDescuentoTotal();
        this.igv = venta.getIgv();
        this.total = venta.getTotal();
        this.idCliente = venta.getIdCliente();
        this.idAlmacen = venta.getIdAlmacen();
        this.estado = venta.getEstado().name();
        this.detalles = venta.getDetalles().stream()
                .map(DetalleVentaResponseDTO::new)
                .toList();
    }
}
