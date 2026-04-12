package com.example.quanlyphongtro.repository;

import com.example.quanlyphongtro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    List<User> findByRole(User.Role role);
}
