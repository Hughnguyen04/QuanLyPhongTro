package com.example.quanlyphongtro.repository;

import com.example.quanlyphongtro.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    List<Contract> findByStatus(Contract.ContractStatus status);
}
