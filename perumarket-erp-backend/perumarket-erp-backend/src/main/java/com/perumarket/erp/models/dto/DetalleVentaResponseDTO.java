package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class DetalleVentaResponseDTO {
    private Integer idProducto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;

    public DetalleVentaResponseDTO() {}

    public DetalleVentaResponseDTO(com.perumarket.erp.models.entity.DetalleVenta detalle) {
        this.idProducto = detalle.getIdProducto();
        this.cantidad = detalle.getCantidad();
        this.precioUnitario = detalle.getPrecioUnitario();
        this.subtotal = detalle.getSubtotal();
    }
}
