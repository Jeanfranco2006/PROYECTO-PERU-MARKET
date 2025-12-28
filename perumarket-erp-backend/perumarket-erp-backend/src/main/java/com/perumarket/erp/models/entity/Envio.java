package com.perumarket.erp.models.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "envio")
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "id_pedido")
    @JsonBackReference
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_vehiculo")
    private Vehiculo vehiculo;

    @ManyToOne
    @JoinColumn(name = "id_conductor")
    private Conductor conductor;

    @ManyToOne
    @JoinColumn(name = "id_ruta")
    private Ruta ruta;

    @Column(name = "direccion_envio")
    private String direccionEnvio;

    private LocalDate fechaEnvio;
    private LocalDate fechaEntrega;

    @Column(name = "costo_transporte")
    private BigDecimal costoTransporte;

    @Enumerated(EnumType.STRING)
    private EstadoEnvio estado;

    private String observaciones;

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

    public enum EstadoEnvio {
        PENDIENTE,
        EN_RUTA,
        ENTREGADO,
        CANCELADO
    }
}
