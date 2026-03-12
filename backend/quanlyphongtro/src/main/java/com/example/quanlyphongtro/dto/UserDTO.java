package com.example.quanlyphongtro.dto;

import com.example.quanlyphongtro.model.User;

public class UserDTO {
    private Integer userId;
    private String username;
    private User.Role role;
    private Boolean isActive;

    public UserDTO(Integer userId, String username, User.Role role, Boolean isActive){
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.isActive = isActive;
    }

    //Getter & Setter
    public Integer getUserId(){
        return userId;
    }
    public void setUserId(Integer userId){
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "userId: " + userId +
                "\nusername: " + username + '\'' +
                "\nrole: " + role +
                "\nisActive: " + isActive;
    }

    public static String notFoundString(){
        return "User not found!";
    }
}
