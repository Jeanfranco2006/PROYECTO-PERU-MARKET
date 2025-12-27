package com.perumarket.erp.models.dto;

import java.util.List;

import lombok.Data;

@Data
public class CrearEnvioDTO {
    private Long idVenta;
    private Long idCliente;
    private String estado;
    private String fechaRegistro;
    private List<ProductoCantidad> productos;

    // getters y setters
@Data
    public static class ProductoCantidad {
        private Long idProducto;
        private int cantidad;
        // getters y setters
    }
}