// ModuloRepository.java
package com.perumarket.erp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.perumarket.erp.models.entity.Modulo;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    
    // CONSULTA NATIVA CORREGIDA - usa tu tabla role_module_permissions
    @Query(value = "SELECT m.* FROM modulo m " +
                   "INNER JOIN role_module_permissions rmp ON m.id = rmp.id_modulo " +
                   "WHERE rmp.id_rol = :roleId " +
                   "AND rmp.has_access = true " +
                   "ORDER BY m.nombre", 
           nativeQuery = true)
    List<Modulo> findModulesByRole(@Param("roleId") Long roleId);
     // MÉTODO NUEVO A AGREGAR (si no lo tienes)
    List<Modulo> findAllByOrderByIdDesc();
}