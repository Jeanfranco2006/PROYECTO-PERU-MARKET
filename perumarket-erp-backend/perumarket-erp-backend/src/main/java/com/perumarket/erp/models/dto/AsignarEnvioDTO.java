package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class AsignarEnvioDTO {

    private Long idVehiculo;
    private Long idConductor;
    private Long idRuta;

    private String direccionEnvio;
    private String fechaEnvio;     // yyyy-MM-dd
    private String fechaEntrega;   // yyyy-MM-dd

    private String estado;         // PENDIENTE, EN_RUTA, ENTREGADO
    private String observaciones;
}
