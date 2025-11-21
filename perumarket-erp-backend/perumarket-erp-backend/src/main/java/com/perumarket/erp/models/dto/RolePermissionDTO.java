package com.perumarket.erp.models.dto;

import lombok.Data;

@Data
public class RolePermissionDTO {
    private Long idModulo;
    private String nombreModulo;
    private Boolean hasAccess;
}
