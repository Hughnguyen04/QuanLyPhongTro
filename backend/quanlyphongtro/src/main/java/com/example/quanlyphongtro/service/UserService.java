package com.example.quanlyphongtro.service;

import com.example.quanlyphongtro.dto.UserDTO;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.repository.UserRepository;
import org.hibernate.mapping.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> getAllUsers(){
        return userRepository.findAll().stream()
                .map(u -> new UserDTO(u.getUserId(), u.getUsername(), u.getRole(), u.getIsActive()))
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found!"));
        return new UserDTO(user.getUserId(), user.getUsername(), user.getRole(), user.getIsActive());
    }

    public UserDTO createUser(User user){
        User saved = userRepository.save(user);
        return new UserDTO(saved.getUserId(), saved.getUsername(), saved.getRole(), saved.getIsActive());
    }

    public UserDTO updateUser(Integer id, User userUpdate) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found!"));

        user.setUsername(userUpdate.getUsername());
        user.setPassword(userUpdate.getPassword());
        user.setRole(userUpdate.getRole());
        user.setIsActive(user.getIsActive());

        User updated = userRepository.save(user);
        return new UserDTO(updated.getUserId(), updated.getUsername(), updated.getRole(),updated.getIsActive());
    }

    public UserDTO deleteUser(Integer id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(id);
        return new UserDTO(user.getUserId(), user.getUsername(), user.getRole(), user.getIsActive());
    }
}
