package com.perumarket.erp.models.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PersonaDTO {
    private Long id;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String direccion;
}