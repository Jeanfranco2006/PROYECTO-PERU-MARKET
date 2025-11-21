package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class RolDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Long usuariosCount;
    private Long modulosActivosCount;
}
