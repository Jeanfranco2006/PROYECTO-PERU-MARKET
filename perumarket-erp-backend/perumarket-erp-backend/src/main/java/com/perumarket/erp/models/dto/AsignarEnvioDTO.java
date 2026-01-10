package com.perumarket.erp.models.dto;

import java.math.BigDecimal; // 1. AGREGAR IMPORTACIÓN
import lombok.Data;

@Data
public class AsignarEnvioDTO {

    private Long idVehiculo;
    private Long idConductor;
    private Long idRuta;

    private String direccionEnvio;
    private String fechaEnvio;     // yyyy-MM-dd
    private String fechaEntrega;   // yyyy-MM-dd

    private BigDecimal costoTransporte; // 2. AGREGAR ESTE CAMPO

    private String estado;         // PENDIENTE, EN_RUTA, ENTREGADO
    private String observaciones;
}