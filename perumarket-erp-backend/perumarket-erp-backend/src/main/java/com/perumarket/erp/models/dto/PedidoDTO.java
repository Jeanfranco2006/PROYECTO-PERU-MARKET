package com.perumarket.erp.models.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PedidoDTO {
 

    private Long id;
    private String codigo;
    private String nombreCliente;
    private BigDecimal total;

}
