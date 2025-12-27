package com.perumarket.erp.repository;

import java.util.List;

import com.perumarket.erp.models.entity.Venta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {
        List<Venta> findByEstado(String estado);
}