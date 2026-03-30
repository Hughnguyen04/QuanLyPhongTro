package com.example.quanlyphongtro.service;

import com.example.quanlyphongtro.dto.UserDTO;
import com.example.quanlyphongtro.dto.request.RegisterRequest;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers(){
        return userRepository.findAll().stream()
                .map(u -> new UserDTO(u.getUserId(), u.getUsername(), u.getRole(), u.getIsActive()))
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found!"));
        return new UserDTO(user.getUserId(), user.getUsername(), user.getRole(), user.getIsActive());
    }

    public UserDTO createUser(RegisterRequest request){
        User saved = new User();

        saved.setUsername(request.getUsername());
        saved.setPassword(passwordEncoder.encode(request.getPassword()));
        saved.setRole(User.Role.valueOf(request.getRole()));
        saved.setIsActive(request.isActive());
        userRepository.save(saved);

        return new UserDTO(saved.getUserId(), saved.getUsername(), saved.getRole(), saved.getIsActive());
    }

    public UserDTO updateUser(Integer id, User userUpdate) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));

        user.setUsername(userUpdate.getUsername());
        user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
        user.setRole(userUpdate.getRole());
        user.setIsActive(user.getIsActive());

        User updated = userRepository.save(user);
        return new UserDTO(updated.getUserId(), updated.getUsername(), updated.getRole(),updated.getIsActive());
    }

    public UserDTO deleteUser(Integer id){
        User user = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!"));
        userRepository.deleteById(id);
        return new UserDTO(user.getUserId(), user.getUsername(), user.getRole(), user.getIsActive());
    }
}
