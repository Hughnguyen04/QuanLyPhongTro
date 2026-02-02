package com.example.quanlyphongtro.repository;

import com.example.quanlyphongtro.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> finByPaymentStatus(Invoice.PaymentStatus status);
}
