package com.perumarket.erp.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.perumarket.erp.models.dto.PedidoDTO;
import com.perumarket.erp.models.entity.Pedido;
import com.perumarket.erp.repository.PedidoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Transactional(readOnly = true)
public List<Pedido> listarPedidosPendientes() {
    return pedidoRepository.findByEstado(Pedido.EstadoPedido.PENDIENTE);
}

@Transactional(readOnly = true)
public List<PedidoDTO> listarPedidosPendientesDTO() {
    return pedidoRepository.findByEstado(Pedido.EstadoPedido.PENDIENTE)
        .stream()
        .map(p -> new PedidoDTO(
            p.getId(),
            "PED-" + p.getId(), // si no tienes código
            p.getCliente() != null && p.getCliente().getPersona() != null 
                ? p.getCliente().getPersona().getNombres() 
                : "Sin cliente",
            p.getTotal()
        ))
        .toList();
}


}
