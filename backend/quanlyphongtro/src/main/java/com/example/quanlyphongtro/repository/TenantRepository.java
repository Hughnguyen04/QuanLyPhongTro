package com.example.quanlyphongtro.repository;

import com.example.quanlyphongtro.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Integer> {

    Optional<Tenant> findByCitizenId(String citizenId);
}
