package com.perumarket.erp.models.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class CrearEnvioDTO {
    private Long idVenta;          // obligatorio, debe existir
    private Long idCliente;        // opcional, solo si quieres registrar cliente
    private Long idVehiculo;       // opcional
    private Long idConductor;      // opcional
    private Long idRuta;           // opcional
    private String direccionEnvio; // opcional
    private String estado;         // PENDIENTE, EN_RUTA, ENTREGADO, CANCELADO
    private String fechaRegistro;  // fecha en formato String (puede ser LocalDate si quieres)
    private String fechaEntrega;   // opcional
    private BigDecimal costoTransporte; // opcional
    private String observaciones;  // opcional
    private List<ProductoCantidad> productos;

    @Data
    public static class ProductoCantidad {
        private Long idProducto;
        private int cantidad;
    }
}


/* package com.perumarket.erp.models.dto;

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
} */