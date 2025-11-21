package com.perumarket.erp.models.dto;

import java.util.List;

import lombok.Data;

@Data
public class UpdatePermissionsRequest {
    private Long idRol;
    private List<RolePermissionDTO> permissions;
}