package com.perumarket.erp.controller;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.perumarket.erp.models.dto.AsignarEnvioDTO;
import com.perumarket.erp.models.dto.EnvioDTO;
import com.perumarket.erp.models.dto.PedidoDTO;
import com.perumarket.erp.models.dto.CrearEnvioDTO;
import com.perumarket.erp.models.entity.Envio;
import com.perumarket.erp.service.EnvioService;
import com.perumarket.erp.service.PedidoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/envios")
public class EnvioController {

    private final EnvioService envioService;
    private final PedidoService pedidoService;
    
    @PersistenceContext
    private EntityManager entityManager;

    public EnvioController(EnvioService envioService, PedidoService pedidoService) {
        this.envioService = envioService;
        this.pedidoService = pedidoService;
    }
    
    @PostMapping
    public ResponseEntity<?> crearEnvio(@RequestBody CrearEnvioDTO dto) {
        try {
            Envio envioCreado = envioService.crearEnvio(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(envioCreado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/asignar")
    public ResponseEntity<Envio> asignarDespacho(
            @PathVariable Long id,
            @RequestBody AsignarEnvioDTO dto) {
        return ResponseEntity.ok(envioService.asignarDespacho(id, dto));
    }

    @GetMapping
    public List<EnvioDTO> listarEnvios() {
        List<Envio> envios = envioService.listarTodos();

        return envios.stream().map(envio -> {
            // Nombre completo del cliente
            String nombreCliente = null;
            if (envio.getPedido() != null && envio.getPedido().getCliente() != null
                    && envio.getPedido().getCliente().getPersona() != null) {
                nombreCliente = envio.getPedido().getCliente().getPersona().getNombres() + " " +
                                envio.getPedido().getCliente().getPersona().getApellidoPaterno() + " " +
                                envio.getPedido().getCliente().getPersona().getApellidoMaterno();
            }

            // Nombre completo del conductor (CORREGIDO)
            String nombreConductor = null;
            if (envio.getConductor() != null && envio.getConductor().getPersona() != null) {
                var p = envio.getConductor().getPersona();
                // Validamos cada campo para evitar "null"
                String n = p.getNombres() != null ? p.getNombres() : "";
                String ap = p.getApellidoPaterno() != null ? p.getApellidoPaterno() : "";
                String am = p.getApellidoMaterno() != null ? p.getApellidoMaterno() : "";
                
                // Unimos y quitamos espacios sobrantes
                nombreConductor = (n + " " + ap + " " + am).trim();
            }

            // Placa del vehículo
            String placaVehiculo = envio.getVehiculo() != null ? envio.getVehiculo().getPlaca() : null;

            // Nombre de la ruta
            String nombreRuta = envio.getRuta() != null ? envio.getRuta().getNombre() : null;

            return new EnvioDTO(
                    envio.getId(),
                    envio.getEstado() != null ? envio.getEstado().name() : null,
                    envio.getFechaEnvio(),
                    envio.getFechaEntrega(),
                    envio.getDireccionEnvio(),
                    envio.getCostoTransporte() != null ? envio.getCostoTransporte().doubleValue() : null,
                    envio.getPedido() != null ? envio.getPedido().getId() : null,
                    envio.getPedido() != null && envio.getPedido().getTotal() != null
                            ? envio.getPedido().getTotal().doubleValue()
                            : null,
                    envio.getPedido() != null && envio.getPedido().getCliente() != null
                            ? envio.getPedido().getCliente().getId()
                            : null,
                    nombreCliente,
                    envio.getConductor() != null ? envio.getConductor().getId() : null,
                    nombreConductor,
                    envio.getVehiculo() != null ? envio.getVehiculo().getId() : null,
                    placaVehiculo,
                    envio.getRuta() != null ? envio.getRuta().getId() : null,
                    nombreRuta
            );
        }).toList();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEnvio(
            @PathVariable Long id,
            @RequestBody AsignarEnvioDTO dto
    ) {
        try {
            Envio envioActualizado = envioService.actualizarEnvio(id, dto);
            return ResponseEntity.ok(envioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // OPCIÓN 1: Usando el método existente de PedidoService
/*     @GetMapping("/pedidos-disponibles")
    public ResponseEntity<List<PedidoDTO>> getPedidosDisponibles() {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPendientesDTO();
        return ResponseEntity.ok(pedidos);
    } */
    

        @GetMapping("/pedidos-disponibles")
    public ResponseEntity<?> getPedidosDisponibles() {
        try {
            System.out.println("=== INICIO: /envios/pedidos-disponibles ===");
            
            // 1. Obtener pedidos del servicio
            List<PedidoDTO> pedidos = pedidoService.listarPedidosPendientesDTO();
            
            System.out.println("Total pedidos obtenidos: " + pedidos.size());
            
            // 2. Log detallado de cada pedido
            for (int i = 0; i < Math.min(pedidos.size(), 5); i++) {
                PedidoDTO p = pedidos.get(i);
                System.out.println(String.format(
                    "Pedido[%d]: ID=%d, EstadoEnvio=%s, TieneEnvio=%s",
                    i, p.getId(), p.getEstadoEnvio(), p.isTieneEnvio()
                ));
            }
            
            System.out.println("=== FIN: /envios/pedidos-disponibles ===");
            
            return ResponseEntity.ok(pedidos);
            
        } catch (Exception e) {
            System.err.println("ERROR en /pedidos-disponibles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Error interno",
                    "mensaje", e.getMessage()
                ));
        }
    }

    // OPCIÓN 2: Versión mejorada con Native Query (Más confiable)
    @GetMapping("/pedidos-disponibles-v2")
    public ResponseEntity<?> getPedidosDisponiblesV2() {
        try {
            List<Object[]> results = entityManager.createNativeQuery("""
                SELECT 
                    p.id,
                    p.id_venta,
                    p.estado,
                    p.total,
                    p.fecha_pedido,
                    p.id_cliente,
                    c.persona_id,
                    per.nombres,
                    per.apellido_paterno,
                    per.apellido_materno,
                    per.dni,
                    e.id as envio_id,
                    e.estado as envio_estado
                FROM pedido p
                LEFT JOIN cliente c ON p.id_cliente = c.id
                LEFT JOIN persona per ON c.persona_id = per.id
                LEFT JOIN envio e ON p.id = e.id_pedido
                WHERE p.estado = 'PENDIENTE'
                AND (e.id IS NULL OR (e.estado = 'PENDIENTE' AND e.fecha_envio IS NULL))
                ORDER BY 
                    CASE WHEN e.id IS NULL THEN 0 ELSE 1 END,
                    p.fecha_pedido DESC
                """).getResultList();
            
            List<Map<String, Object>> pedidosDTO = new ArrayList<>();
            for (Object[] row : results) {
                String nombreCliente = "Sin cliente";
                if (row[7] != null) {
                    nombreCliente = row[7].toString();
                    if (row[8] != null) {
                        nombreCliente += " " + row[8].toString();
                    }
                }
                
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", row[0]);
                dto.put("codigo", "PED-" + row[0]);
                dto.put("idVenta", row[1]);
                dto.put("estado", row[2]);
                dto.put("total", row[3]);
                dto.put("fechaPedido", row[4]);
                dto.put("idCliente", row[5]);
                dto.put("clienteNombre", nombreCliente);
                dto.put("dniCliente", row[10]);
                dto.put("tieneEnvio", row[11] != null);
                dto.put("envioId", row[11]);
                dto.put("estadoEnvio", row[12] != null ? row[12] : "SIN_ENVIO");
                
                pedidosDTO.add(dto);
            }
            
            return ResponseEntity.ok(pedidosDTO);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Error al obtener pedidos disponibles",
                    "detalle", e.getMessage()
                ));
        }
    }
    
    // OPCIÓN 3: Solo pedidos sin envío (si prefieres)
    @GetMapping("/pedidos-sin-envio")
    public ResponseEntity<?> getPedidosSinEnvio() {
        try {
            List<Object[]> results = entityManager.createNativeQuery("""
                SELECT 
                    p.id,
                    p.id_venta,
                    p.estado,
                    p.total,
                    p.fecha_pedido,
                    p.id_cliente,
                    c.persona_id,
                    per.nombres,
                    per.apellido_paterno,
                    per.dni
                FROM pedido p
                LEFT JOIN cliente c ON p.id_cliente = c.id
                LEFT JOIN persona per ON c.persona_id = per.id
                WHERE p.estado = 'PENDIENTE'
                AND p.id NOT IN (SELECT id_pedido FROM envio)
                ORDER BY p.fecha_pedido DESC
                """).getResultList();
            
            List<Map<String, Object>> pedidosDTO = new ArrayList<>();
            for (Object[] row : results) {
                String nombreCliente = "Sin cliente";
                if (row[7] != null) {
                    nombreCliente = row[7].toString();
                    if (row[8] != null) {
                        nombreCliente += " " + row[8].toString();
                    }
                }
                
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", row[0]);
                dto.put("codigo", "PED-" + row[0]);
                dto.put("idVenta", row[1]);
                dto.put("estado", row[2]);
                dto.put("total", row[3]);
                dto.put("fechaPedido", row[4]);
                dto.put("idCliente", row[5]);
                dto.put("clienteNombre", nombreCliente);
                dto.put("dniCliente", row[9]);
                dto.put("tieneEnvio", false);
                dto.put("estadoEnvio", "SIN_ENVIO");
                
                pedidosDTO.add(dto);
            }
            
            return ResponseEntity.ok(pedidosDTO);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}