// RoleModulePermissions.java
package com.perumarket.erp.models.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "role_module_permissions")
@Data
public class RoleModulePermissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_rol")
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "id_modulo")
    private Modulo modulo;

    @Column(name = "has_access")
    private Boolean hasAccess;
}