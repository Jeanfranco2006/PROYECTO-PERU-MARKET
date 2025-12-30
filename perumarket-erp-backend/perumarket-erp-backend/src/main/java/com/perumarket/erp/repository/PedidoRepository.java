package com.perumarket.erp.repository;

import java.util.List;
import java.util.Optional;

import com.perumarket.erp.models.entity.Pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByVentaId(Long ventaId);
      List<Pedido> findByEstado(Pedido.EstadoPedido estado);

    @Query("""
        SELECT DISTINCT p FROM Pedido p
        JOIN FETCH p.venta v
        LEFT JOIN FETCH p.envio e
        WHERE p.estado = 'PENDIENTE'
    """)
    List<Pedido> findPedidosPendientesConVentaYEnvio();

}