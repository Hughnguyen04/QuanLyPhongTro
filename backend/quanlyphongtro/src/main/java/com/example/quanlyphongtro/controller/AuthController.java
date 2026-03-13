package com.example.quanlyphongtro.controller;


import com.example.quanlyphongtro.dto.request.LoginRequest;
import com.example.quanlyphongtro.dto.request.RegisterRequest;
import com.example.quanlyphongtro.dto.response.LoginResponse;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import com.example.quanlyphongtro.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        Integer successLogin = authService.login(request);
        if(successLogin == 1) {
            return new LoginResponse("Đăng nhập thành công");
        } if (successLogin == 0){
            return new LoginResponse("Sai username hoặc password");
        } else {
            return new LoginResponse("Không tìm thấy User");
        }
    }
}
