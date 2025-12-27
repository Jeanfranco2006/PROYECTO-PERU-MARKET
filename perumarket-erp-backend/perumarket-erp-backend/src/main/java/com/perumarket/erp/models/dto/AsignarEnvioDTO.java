package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class AsignarEnvioDTO {
    private Long idVehiculo;
    private Long idConductor;
    private Long idRuta;
    private String observaciones;
}
