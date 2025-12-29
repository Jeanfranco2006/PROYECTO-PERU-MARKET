package com.perumarket.erp.models.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RutaDTO {
    private String nombre;
    private String origen;
    private String destino;
    private BigDecimal distancia_km;
    private BigDecimal tiempo_estimado_horas;
    private BigDecimal costo_base;
}