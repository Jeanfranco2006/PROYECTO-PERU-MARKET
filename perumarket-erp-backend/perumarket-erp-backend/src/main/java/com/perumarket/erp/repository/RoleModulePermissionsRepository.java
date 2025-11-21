// En RoleModulePermissionsRepository.java - VERIFICA QUE TENGA ESTE MÉTODO
package com.perumarket.erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.RoleModulePermissions;

@Repository
public interface RoleModulePermissionsRepository extends JpaRepository<RoleModulePermissions, Long> {
    
    @Query("SELECT rmp FROM RoleModulePermissions rmp " +
           "JOIN FETCH rmp.modulo " +
           "WHERE rmp.rol.id = :rolId AND rmp.hasAccess = true")
    List<RoleModulePermissions> findAccessibleModulesByRolId(@Param("rolId") Long rolId);
    
    List<RoleModulePermissions> findByRolId(Long rolId);
    
    // ESTE MÉTODO ES CRÍTICO - DEBE ESTAR PRESENTE
    @Modifying
    @Query("DELETE FROM RoleModulePermissions rmp WHERE rmp.rol.id = :rolId")
    void deleteByRolId(@Param("rolId") Long rolId);
}