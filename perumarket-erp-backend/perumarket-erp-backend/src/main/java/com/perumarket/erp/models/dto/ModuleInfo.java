// ModuleInfo.java
package com.perumarket.erp.models.dto;

public class ModuleInfo {
    private Long id;
    private String nombre;
    private String descripcion;
    private String ruta;

    // Constructores
    public ModuleInfo() {}

    public ModuleInfo(Long id, String nombre, String descripcion, String ruta) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.ruta = ruta;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }
}