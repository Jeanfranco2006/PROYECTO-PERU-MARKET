package com.perumarket.erp.models.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@Entity
@Table(name = "conductor")
public class Conductor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_persona", nullable = false)
    private Persona persona;

    @Column(nullable = false, length = 20, unique = true)
    private String licencia;

    @Column(name = "categoria_licencia", length = 10)
    private String categoriaLicencia;

    @Enumerated(EnumType.STRING)
    private EstadoConductor estado;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;

public enum EstadoConductor {
    DISPONIBLE,
    EN_RUTA,
    INACTIVO
}

    // getters y setters
}
