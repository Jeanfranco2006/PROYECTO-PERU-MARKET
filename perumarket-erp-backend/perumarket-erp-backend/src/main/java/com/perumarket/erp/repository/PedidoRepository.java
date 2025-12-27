package com.perumarket.erp.repository;

import java.util.Optional;

import com.perumarket.erp.models.entity.Pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByVentaId(Long ventaId);
}