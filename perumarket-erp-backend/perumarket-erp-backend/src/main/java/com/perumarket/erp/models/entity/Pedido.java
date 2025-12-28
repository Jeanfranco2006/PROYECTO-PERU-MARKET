package com.perumarket.erp.models.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_venta", nullable = false)
    private Venta venta;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    private BigDecimal total;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

   @OneToOne(mappedBy = "pedido")
@JsonManagedReference
    private Envio envio;

    public enum EstadoPedido {
        PENDIENTE,
        EN_PROCESO,
        EN_CAMINO,
        ENTREGADO,
        CANCELADO
    }
}
