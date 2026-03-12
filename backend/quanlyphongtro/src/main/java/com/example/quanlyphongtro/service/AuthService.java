package com.example.quanlyphongtro.service;

import com.example.quanlyphongtro.dto.request.LoginRequest;
import com.example.quanlyphongtro.dto.request.RegisterRequest;
import com.example.quanlyphongtro.dto.response.LoginResponse;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request){
        User user = new User();
        user.setUsername(request.getUsername());
        //Mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole()));
        user.setIsActive(true);

        return userRepository.save(user);
    }

    public Integer login(LoginRequest request){
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if(userOpt.isPresent()){
            User user = userOpt.get();
            //So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong DB
            Integer result = passwordEncoder
                                .matches(request.getPassword(),  user.getPassword())
                                ? 1 : 0;
            return result;
        }
        return -1;
    }
}
