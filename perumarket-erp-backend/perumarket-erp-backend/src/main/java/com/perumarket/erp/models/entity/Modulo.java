// Modulo.java
package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "modulo")
@Data
public class Modulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;
    private String ruta;
}