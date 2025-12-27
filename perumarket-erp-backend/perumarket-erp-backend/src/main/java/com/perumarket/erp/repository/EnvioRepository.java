package com.perumarket.erp.repository;

import java.util.Optional;

import com.perumarket.erp.models.entity.Envio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface EnvioRepository extends JpaRepository<Envio, Long> {

    Optional<Envio> findByPedidoId(Long pedidoId);
}