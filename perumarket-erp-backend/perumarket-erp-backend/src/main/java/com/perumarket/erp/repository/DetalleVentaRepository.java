package com.perumarket.erp.repository;

import com.perumarket.erp.models.entity.DetalleVenta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {
    @Modifying
    @Query(value = "DELETE FROM detalle_venta WHERE id_producto = :idProducto", nativeQuery = true)
    void deleteByProductoId(@Param("idProducto") Integer idProducto);
}