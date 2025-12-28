package com.perumarket.erp.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;


@AllArgsConstructor
@Data
public class EnvioDTO {
    private Long idEnvio;
    private String estado;
    private LocalDate fechaEnvio;
    private LocalDate fechaEntrega;
    private String direccionEnvio;
    private Double costoTransporte;

    private Long idPedido;
    private Double totalPedido;

    private Long idCliente;
    private String nombreCliente;

    private Long idConductor;
    private String nombreConductor;

    private Long idVehiculo;
    private String placaVehiculo;

    private Long idRuta;
    private String nombreRuta;
}
