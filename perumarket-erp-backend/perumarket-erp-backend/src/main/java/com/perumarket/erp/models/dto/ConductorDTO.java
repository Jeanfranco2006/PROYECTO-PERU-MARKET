package com.perumarket.erp.models.dto;

import java.time.LocalDate;

import com.perumarket.erp.models.entity.Conductor.EstadoConductor;

import lombok.Data;

@Data
public class ConductorDTO {

    // Datos de la persona
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    private String telefono;
    private String direccion;
    private LocalDate fechaNacimiento; // formato "yyyy-MM-dd"

    // Datos del conductor
    private String licencia;
    private String categoriaLicencia;
    private EstadoConductor estado; // DISPONIBLE | EN_RUTA | INACTIVO
}