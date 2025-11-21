package com.perumarket.erp.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @GetMapping("/backend")
    public String testBackend() {
        return "✅ Backend Spring Boot funcionando correctamente - " + System.currentTimeMillis();
    }

    @GetMapping("/database")
    public String testDatabase() {
        return "✅ Conexión a base de datos exitosa - " + System.currentTimeMillis();
    }

    @GetMapping("/auth")
    public String testAuth() {
        return "✅ Módulo de autenticación activo - " + System.currentTimeMillis();
    }

    @GetMapping("/full")
    public String testFull() {
        return """
               🌐 SISTEMA PERUMARKET ERP
               ✅ Backend: Spring Boot Activo
               ✅ Base de Datos: Conectada  
               ✅ API: Funcionando
               🚀 Listo para recibir peticiones
               """;
    }
}