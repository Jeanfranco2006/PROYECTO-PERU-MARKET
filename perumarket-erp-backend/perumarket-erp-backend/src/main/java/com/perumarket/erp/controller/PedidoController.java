package com.perumarket.erp.controller;

import java.util.List;

import com.perumarket.erp.models.dto.PedidoDTO;

import com.perumarket.erp.models.entity.Pedido;
import com.perumarket.erp.service.PedidoService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {
    private final PedidoService pedidoService;

    // Listar todos los pedidos
    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.listarTodos();
    }

    // Crear un pedido (opcional, ya lo haces desde VentaService)
    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        return pedidoService.guardarPedido(pedido);
    }

    @GetMapping("/pedidos-pendientes")
    public List<PedidoDTO> listarPedidosPendientes() {
        return pedidoService.listarPedidosPendientesDTO();
    }

}
