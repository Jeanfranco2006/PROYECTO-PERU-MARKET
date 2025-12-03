package com.perumarket.erp.controller;

import java.util.List;
import com.perumarket.erp.models.dto.VentaDTO;
import com.perumarket.erp.models.dto.VentaResponseDTO;
import com.perumarket.erp.models.entity.Venta;
import com.perumarket.erp.service.VentaService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

@PostMapping
public VentaResponseDTO registrar(@RequestBody VentaDTO ventaDTO) {
    Venta venta = ventaService.procesarVenta(ventaDTO);
    return new VentaResponseDTO(venta);
}

    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarVentas();
    }
}
