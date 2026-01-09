package com.perumarket.erp.models.dto;

import java.math.BigDecimal;

import lombok.Data;
@Data
public class VehiculoDTO {
        private String placa;
    private String marca;
    private String modelo;

    // lo que viene del frontend
    private BigDecimal capacidadKg;

    private String estado; // DISPONIBLE, EN_RUTA, etc.
}
