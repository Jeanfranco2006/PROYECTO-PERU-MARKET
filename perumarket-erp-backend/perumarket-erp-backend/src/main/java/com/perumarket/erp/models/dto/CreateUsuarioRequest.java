package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class CreateUsuarioRequest {
    private String username;
    private String password;
    private String estado;
    private Long idRol;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String correo;
    private String telefono;
    private String fechaNacimiento;
    private String direccion;
}
