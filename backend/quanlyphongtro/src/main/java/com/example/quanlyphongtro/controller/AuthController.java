package com.example.quanlyphongtro.controller;


import com.example.quanlyphongtro.dto.request.LoginRequest;
import com.example.quanlyphongtro.dto.request.RegisterRequest;
import com.example.quanlyphongtro.dto.response.LoginResponse;
import com.example.quanlyphongtro.dto.response.RegisterResponse;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import com.example.quanlyphongtro.service.AuthService;
import com.example.quanlyphongtro.service.CustomUserDetailsService;
import com.example.quanlyphongtro.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

//    @Autowired
//    private AuthenticationManager authenticationManager;

//    @Autowired
//    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request){
        Integer registerStatus = authService.register(request);
        if(registerStatus == 1) {
            return new RegisterResponse("Đăng ký thành công!");
        }
        if (registerStatus == 0) {
            return new RegisterResponse("Tên đăng nhập đã tồn tại!");
        }
        return new RegisterResponse("Đăng ký thất bại! Hãy kiểm tra lại thông tin!");

    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest request){
//        Integer successLogin = authService.login(request);
//        if(successLogin == 1) {
//            return new LoginResponse("Đăng nhập thành công");
//        } if (successLogin == 0){
//            return new LoginResponse("Sai username hoặc password");
//        } else {
//            return new LoginResponse("Không tìm thấy User");
//        }
//    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        //Check username và pw với authenticationManager
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        loginRequest.getUsername(),
//                        loginRequest.getPassword()));

//        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getUsername());
//        final String jwt = jwtUtil.generateToken(userDetails);

        //
        final String token = authService.login(loginRequest.getUsername(), loginRequest.getPassword());

        return ResponseEntity.ok(new LoginResponse(token));
    }
}
