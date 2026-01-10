package com.perumarket.erp.models.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class CrearEnvioDTO {
    private Long idVenta;         
    private Long idCliente;        
    private Long idVehiculo;       
    private Long idConductor;      
    private Long idRuta;           
    private String direccionEnvio; 
    private String estado;         // PENDIENTE, EN_RUTA, ENTREGADO, CANCELADO
    
    // --- AGREGAR ESTE CAMPO ---
    private String fechaEnvio;     // <--- Faltaba este campo
    // -------------------------

    private String fechaRegistro;  
    private String fechaEntrega;   
    private BigDecimal costoTransporte; 
    private String observaciones;  
    private List<ProductoCantidad> productos;

    @Data
    public static class ProductoCantidad {
        private Long idProducto;
        private int cantidad;
    }
}