package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.ProveedorProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Importante
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProveedorProductoRepository extends JpaRepository<ProveedorProducto, Integer> {
    
    // Busca el proveedor principal de un producto (Lo dejamos igual)
    @Query("SELECT pp FROM ProveedorProducto pp JOIN FETCH pp.proveedor WHERE pp.producto.id = :productoId AND pp.esPrincipal = true")
    Optional<ProveedorProducto> findByProductoIdAndEsPrincipalTrue(@Param("productoId") Integer productoId);
    
    // --- AQUÍ ESTÁ LA CORRECCIÓN CLAVE ---
    // Filtramos para traer solo productos que estén en estado 'CATALOGO'
    @Query("SELECT pp FROM ProveedorProducto pp " +
           "JOIN FETCH pp.producto p " +
           "WHERE pp.proveedor.id = :proveedorId " +
           "AND p.estado = 'CATALOGO'") // <--- ESTA LÍNEA HACE LA MAGIA
    List<ProveedorProducto> findByProveedorId(@Param("proveedorId") Integer proveedorId);
    // -------------------------------------

    List<ProveedorProducto> findByProductoId(Integer productoId);
    
    void deleteByProductoId(Integer idProducto);
}