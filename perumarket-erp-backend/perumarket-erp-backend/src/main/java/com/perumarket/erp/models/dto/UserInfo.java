// UserInfo.java
package com.perumarket.erp.models.dto;

public class UserInfo {
    private Long id;
    private String username;
    private String nombres;
    private String apellidos;
    private String rol;
    private String email;

    // Constructores
    public UserInfo() {}

    public UserInfo(Long id, String username, String nombres, String apellidos, String rol, String email) {
        this.id = id;
        this.username = username;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.rol = rol;
        this.email = email;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}