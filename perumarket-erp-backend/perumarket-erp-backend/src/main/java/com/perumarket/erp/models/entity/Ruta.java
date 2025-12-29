package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "ruta")
public class Ruta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String origen;
    private String destino;

    @Column(name = "distancia_km")
    private BigDecimal distanciaKm;

    @Column(name = "tiempo_estimado_horas")
    private BigDecimal tiempoEstimadoHoras;

    @Column(name = "costo_base")
    private BigDecimal costoBase;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;
}

