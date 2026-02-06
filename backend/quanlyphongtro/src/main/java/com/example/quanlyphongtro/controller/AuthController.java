package com.example.quanlyphongtro.controller;


import com.example.quanlyphongtro.dto.request.LoginRequest;
import com.example.quanlyphongtro.dto.response.LoginResponse;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()){
            User user = userOpt.get();

            //Tạm thời so sánh pw trực tiếp => sửa sau
            if(user.getPassword().equals(request.getPassword())){
                return new LoginResponse("Đăng nhập thành công!", "test-token");
            } else {
                return new LoginResponse("Sai mật khẩu", null);
            }
        } else {
            return new LoginResponse("Không tìm thấy user", null);
        }
    }
}
