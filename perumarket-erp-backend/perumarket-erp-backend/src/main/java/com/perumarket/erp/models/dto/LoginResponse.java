// LoginResponse.java
package com.perumarket.erp.models.dto;

import java.util.List;

public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private UserInfo user;
    private List<ModuleInfo> modules;

    // Constructores
    public LoginResponse() {}

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LoginResponse(boolean success, String message, String token, UserInfo user, List<ModuleInfo> modules) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
        this.modules = modules;
    }

    // Getters y Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public List<ModuleInfo> getModules() {
        return modules;
    }

    public void setModules(List<ModuleInfo> modules) {
        this.modules = modules;
    }
}