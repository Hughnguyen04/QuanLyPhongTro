package com.example.quanlyphongtro.service;

import com.example.quanlyphongtro.dto.request.LoginRequest;
import com.example.quanlyphongtro.dto.request.RegisterRequest;
import com.example.quanlyphongtro.dto.response.LoginResponse;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import com.example.quanlyphongtro.utils.JwtUtil;
import io.jsonwebtoken.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    public Integer register(RegisterRequest request){
        User user = new User();

        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            return 0; // Đã có username này
        } else {
            user.setUsername(request.getUsername());
            //Mã hóa mật khẩu trước khi lưu
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.valueOf(request.getRole()));
            user.setIsActive(true);

            userRepository.save(user);

            if(userRepository.findByUsername(request.getUsername()).isPresent()){
                return 1; // Tạo tài khoản thành công
            }
            return -1; // Tạo tài khoản lỗi
        }
    }

//    public Integer login(LoginRequest request){
//        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
//
//        if(userOpt.isPresent()){
//            User user = userOpt.get();
//            //So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong DB
//            Integer result = passwordEncoder
//                                .matches(request.getPassword(),  user.getPassword())
//                                ? 1 : 0;
//            return result;
//        }
//        return -1;
//    }

    //Đăng nhập có xác thực với jwt
    public String login(String userName, String rawPassword){
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(userName);

        if(passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
            return jwtUtil.generateToken(userDetails);
        }
        return "Sai mật khẩu!";
    }
}
