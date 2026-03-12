package com.example.quanlyphongtro.controller;

import com.example.quanlyphongtro.dto.UserDTO;
import com.example.quanlyphongtro.model.User;
import com.example.quanlyphongtro.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Integer id){
        return userService.getUserById(id);
    }

    @PostMapping
    public UserDTO createUser(@RequestBody User user){
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Integer id, @RequestBody User userUpdate){
        return userService.updateUser(id, userUpdate);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Integer id){
        String deletedUsername = userService.deleteUser(id).getUsername();
        return "User " + "\"" + deletedUsername + "\"" + " deleted successfully!\n" ;
    }
}
